#!/usr/bin/env node
// 매지컬 비둘기 스토어 페이지를 만드는 도구 (README의 '매지컬 비둘기 스토어 페이지').
//
// 게임 저장소 docs/store/의 문서 넷(이용약관, 개인정보 처리방침, 환불 안내, 확률 정보)을 원문 그대로 HTML로
// 옮기고, 자리표시 {{ }}를 config.json의 값으로 채운다. 공지 페이지는 notices/의 마크다운 파일(공지 하나에 파일
// 하나)로 만든다. 자리표시가 하나라도 남으면 공개 폴더에 아무것도 쓰지 않는다. Node 내장 모듈만 쓴다(설치할 것
// 없음). 이 폴더는 이름이 _로 시작해 GitHub Pages(Jekyll)가 게시하지 않는다.
//
//   node _magical-dove/pages.mjs check   남은 자리표시, 다시 만들어야 하는 페이지, 본문의 끊긴 링크, 공지 파일의 형식을 봄. 하나라도 있으면 실패
//   node _magical-dove/pages.mjs build   모두 채워졌을 때만 공개 폴더(siteUrl의 경로, 지금은 MagicalDove/)에 페이지를 씀
//   node _magical-dove/pages.mjs sync [--repo ../Magical-Dove] [--ref origin/main]
//                                        원문을 가져와 각 문서의 최신 버전 사본에 씀. 내부 메모(맨 위 인용 블록,
//                                        memoAfterRule인 문서의 '---' 뒤)는 빼고 씀
//   node _magical-dove/pages.mjs serve [--port 8765] [--draft]
//                                        GitHub Pages처럼 경로를 찾는 로컬 서버('terms' → terms.html, _ 폴더 숨김).
//                                        --draft는 남은 자리표시를 표시한 미리보기를 공개 폴더 대신 보여 줌(디스크에 쓰지 않음)
//   --config <파일>                      다른 설정으로 실행(시험용). build의 --out <폴더>는 쓰는 곳만 바꿈

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const GENERATOR = '_magical-dove/pages.mjs';
const GENERATOR_META = `<meta name="generator" content="${GENERATOR}">`;
const PLACEHOLDER = /\{\{([^{}]*)\}\}/g;
const DERIVED = '웹사이트'; // always siteUrl, so the address in the text and the address of the pages cannot differ

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);
const show = (file) => relative(ROOT, file).split(sep).join('/');

// ---------- 설정 ----------

function readConfig() {
  return JSON.parse(readFileSync(resolve(arg('config', join(HERE, 'config.json'))), 'utf8'));
}

const filled = (v) => typeof v === 'string' && v.trim() !== '';
const sitePath = (cfg) => new URL(cfg.siteUrl).pathname.split('/').filter(Boolean);
const siteDir = (cfg) => join(ROOT, ...sitePath(cfg));
const snapshotPath = (doc, version) => join(HERE, 'source', doc.file.replace(/\.md$/, ''), `${version}.md`);
const NOTICE_DIR = join(HERE, 'notices');
const NOTICE_NAME = /^(\d{4})-(\d{2})-(\d{2})-[a-z0-9]+(-[a-z0-9]+)*\.md$/;
const valuesFor = (cfg, version) => ({ ...cfg.values, ...(version?.values ?? {}), [DERIVED]: cfg.siteUrl });
const badValue = (v) => v !== null && (typeof v !== 'string' || /[\n{}|]/.test(v));

/** What is wrong with config.json itself (values still to fill are reported separately). */
function configProblems(cfg) {
  const p = [];
  const site = cfg.siteUrl;
  // the same rule the game applies to its VITE_SITE_URL: https, no trailing '/', no query
  if (typeof site !== 'string' || !/^https:\/\/[a-z0-9.-]+(:\d+)?(\/[\w\-./~%]*)?$/i.test(site) || site.endsWith('/')) {
    p.push(`siteUrl은 https로 시작하고 끝에 '/'와 쿼리가 없는 주소여야 함: ${JSON.stringify(site)}`);
  } else if (!sitePath(cfg).length) {
    p.push('siteUrl에 경로가 있어야 함(도메인 루트에 두면 홈페이지와 겹침)');
  }
  if (!filled(cfg.gameName)) p.push('gameName이 비었음');
  for (const [k, v] of Object.entries(cfg.values ?? {})) {
    if (k === DERIVED) p.push(`values.${DERIVED}는 적지 않음(siteUrl에서 정해짐)`);
    else if (badValue(v)) p.push(`values["${k}"]는 null이나 문자열이고 줄바꿈, {, }, |가 없어야 함`);
  }
  const ids = new Set(['support', 'archive', 'notices', 'doc']);
  for (const d of cfg.documents ?? []) {
    if (!/^[a-z][a-z0-9-]*$/.test(d.id ?? '') || ids.has(d.id)) p.push(`documents의 id가 잘못되었거나 겹침: ${d.id}`);
    ids.add(d.id);
    if (!filled(d.file) || !filled(d.label)) p.push(`${d.id}: file과 label이 있어야 함`);
    if (!Array.isArray(d.versions) || !d.versions.length) {
      p.push(`${d.id}: versions가 비었음`);
      continue;
    }
    const seen = new Set();
    for (const v of d.versions) {
      if (!/^\d+(\.\d+)*$/.test(v.version ?? '') || seen.has(v.version)) p.push(`${d.id}: 버전 번호가 잘못되었거나 겹침: ${v.version}`);
      seen.add(v.version);
      for (const [k, val] of Object.entries(v.values ?? {})) if (k === DERIVED || badValue(val)) p.push(`${d.id} ${v.version}: values["${k}"]`);
    }
  }
  if (!cfg.documents?.length) p.push('documents가 비었음');
  return p;
}

// ---------- 페이지 목록 ----------

/** Every page the site gets. The newest version of a document is {사이트}/<id>, older ones {사이트}/archive/<id>-<version>.html. */
function pageList(cfg) {
  const list = [];
  for (const doc of cfg.documents) {
    doc.versions.forEach((version, i) => {
      const current = i === doc.versions.length - 1;
      list.push({ rel: current ? `${doc.id}.html` : `archive/${doc.id}-${version.version}.html`, doc, version, current });
    });
  }
  list.push({ rel: 'notices.html', notices: true, current: true });
  list.push({ rel: 'support.html', support: true, current: true });
  return list;
}

/** Paths under {사이트}/ that answer, for checking the links in the text. */
function routes(cfg) {
  const r = new Set();
  for (const pg of pageList(cfg)) {
    r.add(pg.rel);
    if (pg.current) r.add(pg.rel.replace(/\.html$/, ''));
  }
  return r;
}

/** Placeholders the values do not fill, with where they are. */
function unfilled(cfg) {
  const out = [];
  const scan = (file, values) => {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      for (const m of line.matchAll(PLACEHOLDER)) {
        if (!filled(values[m[1].trim()])) out.push({ name: m[1].trim(), raw: m[0], file: show(file), line: i + 1 });
      }
    });
  };
  for (const doc of cfg.documents) {
    for (const version of doc.versions) {
      const file = snapshotPath(doc, version.version);
      if (existsSync(file)) scan(file, valuesFor(cfg, version));
    }
  }
  for (const n of readNotices()) scan(n.file, valuesFor(cfg));
  if (!filled(cfg.values?.['이메일'])) out.push({ name: '이메일', raw: '{{이메일}}', file: 'support', line: '문의 메일' });
  return out;
}

/**
 * The notices: one markdown file each in notices/, named after the day it is posted (2027-01-05-terms.md), its first line
 * '# 제목' and the text after it. Newest first (by file name, so by date). Each comes with what is wrong with it.
 */
function readNotices() {
  if (!existsSync(NOTICE_DIR)) return [];
  const names = readdirSync(NOTICE_DIR).filter((f) => !f.startsWith('.')).sort().reverse();
  return names.map((name) => {
    const file = join(NOTICE_DIR, name);
    const problems = [];
    const m = NOTICE_NAME.exec(name);
    const date = m ? `${m[1]}-${m[2]}-${m[3]}` : '';
    let blocks = [];
    if (!m) {
      problems.push(`${show(file)}: 파일 이름은 '올린 날-영문 소문자와 숫자.md' (예: 2027-01-05-terms.md)`);
    } else if (new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toISOString().slice(0, 10) !== date) {
      problems.push(`${show(file)}: 파일 이름의 날짜가 없는 날짜`);
    } else {
      try {
        blocks = parseBlocks(readFileSync(file, 'utf8'), show(file));
      } catch (e) {
        problems.push(e.message);
      }
      if (problems.length) blocks = [];
      else if (blocks[0]?.type !== 'h' || blocks[0].level !== 1) problems.push(`${show(file)}: 첫 줄이 '# 제목'이 아님`);
      else if (blocks.length < 2) problems.push(`${show(file)}: 제목 아래 본문이 없음`);
      else if (blocks.slice(1).some((b) => b.type === 'h' && b.level === 1)) problems.push(`${show(file)}: '# 제목'은 첫 줄에만`);
    }
    return { file, id: name.replace(/\.md$/, ''), date, blocks, problems };
  });
}

// ---------- 마크다운 (원문에 쓰인 만큼: 제목, 문단, 번호와 글머리 목록과 한 단계 아래 목록, 표, 인용, 링크) ----------

const ITEM = /^( *)(\d+\.|-)\s+(.*)$/;
const RULE = /^-{3,}\s*$/;
const startsBlock = (l) => /^#{1,3}\s/.test(l) || /^\s*\|/.test(l) || /^>/.test(l) || RULE.test(l) || /^(\d+\.|-)\s/.test(l);

function cells(row) {
  let s = row.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

function parseBlocks(md, where) {
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    let m;
    if (!line.trim()) {
      i++;
    } else if ((m = /^(#{1,3})\s+(.+)$/.exec(line))) {
      blocks.push({ type: 'h', level: m[1].length, text: m[2].trim() });
      i++;
    } else if (/^\s*\|/.test(line)) {
      const start = i;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      if (rows.length < 2 || !rows[1].every((c) => /^:?-{3,}:?$/.test(c))) throw new Error(`${where}:${start + 1}: 표의 둘째 줄이 구분선이 아님`);
      const [head, , ...body] = rows;
      body.forEach((r, k) => {
        if (r.length !== head.length) throw new Error(`${where}:${start + 3 + k}: 표의 칸 수(${r.length})가 머리줄(${head.length})과 다름`);
      });
      blocks.push({ type: 'table', head, rows: body });
    } else if (/^>/.test(line)) {
      const q = [];
      while (i < lines.length && /^>/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
      blocks.push({ type: 'quote', text: q.join(' ') });
    } else if (RULE.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
    } else if (ITEM.exec(line)?.[1] === '') {
      const list = { type: 'list', ordered: /\d/.test(ITEM.exec(line)[2]), items: [] };
      while (i < lines.length) {
        const im = ITEM.exec(lines[i]);
        if (!im) break;
        const ordered = /\d/.test(im[2]);
        const item = { marker: im[2], text: im[3], sub: null };
        if (im[1] === '') {
          if (ordered !== list.ordered) break;
          list.items.push(item);
        } else {
          const parent = list.items.at(-1);
          parent.sub ??= { ordered, items: [] };
          parent.sub.items.push(item);
        }
        i++;
      }
      blocks.push(list);
    } else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) para.push(lines[i++].trim());
      blocks.push({ type: 'p', text: para.join(' ') });
    }
  }
  return blocks;
}

/** The version in the last row of the document's last 버전 table, or null when it has none. */
function tableVersion(md) {
  const t = parseBlocks(md, '').filter((b) => b.type === 'table' && b.head[0] === '버전').at(-1);
  return t?.rows.at(-1)?.[0] ?? null;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// [text](url) | a bare address | **strong** | a mail address. A link into the repository (README.md and the like) keeps its words only.
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>()[\]{}"',ㄱ-힝]+)|\*\*([^*]+)\*\*|([\w.+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+)/gi;

/** One line of the text as HTML: placeholders filled (or marked, when there is no value), links made, the rest escaped. */
function inline(text, ctx) {
  const s = text.replace(PLACEHOLDER, (raw, name) => {
    const v = ctx.values[name.trim()];
    if (filled(v)) return v;
    ctx.missing.push(raw);
    return `${ctx.missing.length - 1}`;
  });
  let out = '';
  let last = 0;
  for (const m of s.matchAll(TOKEN)) {
    out += esc(s.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1] !== undefined) {
      out += /^https?:\/\//.test(m[2]) && !m[2].includes('') ? `<a href="${esc(m[2])}">${esc(m[1])}</a>` : esc(m[1]);
    } else if (m[3] !== undefined) {
      const trail = /[.:;!?]+$/.exec(m[3])?.[0] ?? '';
      const url = m[3].slice(0, m[3].length - trail.length);
      out += (url.includes('') ? esc(url) : `<a href="${esc(url)}">${esc(url)}</a>`) + esc(trail);
    } else if (m[4] !== undefined) {
      out += `<strong>${esc(m[4])}</strong>`;
    } else {
      out += `<a href="mailto:${esc(m[5])}">${esc(m[5])}</a>`; // tapping it on a phone opens the mail app
    }
  }
  out += esc(s.slice(last));
  return out.replace(/(\d+)/g, (_, n) => `<mark class="md-todo">${esc(ctx.missing[n])}</mark>`);
}

/** Stable anchors: 제3장 → chapter-3, 제16조 → article-16, '2. …' → section-2, '가. …' under it → section-2-가. */
function headingId(h, ctx) {
  let m;
  let id;
  if ((m = /^제(\d+)장/.exec(h.text))) id = `chapter-${m[1]}`;
  else if ((m = /^제(\d+)조/.exec(h.text))) id = `article-${m[1]}`;
  else if ((m = /^(\d+)\.\s/.exec(h.text))) id = `section-${m[1]}`;
  else if ((m = /^([가-힣])\.\s/.exec(h.text)) && ctx.lastH2) id = `${ctx.lastH2}-${m[1]}`;
  else id = h.text.replace(PLACEHOLDER, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'section';
  id = (ctx.idPrefix ?? '') + id; // a notice's headings carry the notice's id, so two notices never share an anchor
  let unique = id;
  for (let n = 2; ctx.ids.has(unique); n++) unique = `${id}-${n}`;
  ctx.ids.add(unique);
  if (h.level === 2) ctx.lastH2 = unique;
  return unique;
}

function renderList(list, ctx) {
  const items = list.items.map((it) => {
    const sub = it.sub ? renderList(it.sub, ctx) : '';
    // the number is part of the text (조항 번호 are copied and searched with it), not a list marker
    return list.ordered ? `<li><span class="md-ol__n">${esc(it.marker)}</span> ${inline(it.text, ctx)}${sub}</li>` : `<li>${inline(it.text, ctx)}${sub}</li>`;
  });
  return list.ordered ? `<ol class="md-ol" role="list">${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`;
}

function renderTable(t, ctx) {
  const versions = t.head[0] === '버전';
  const head = `<thead><tr>${t.head.map((c) => `<th scope="col">${inline(c, ctx)}</th>`).join('')}</tr></thead>`;
  const body = t.rows
    .map((r) => {
      const tds = r.map((c, j) => {
        let cell = inline(c, ctx);
        if (j === 0 && versions && ctx.versionLinks.has(c)) cell = `<a href="${esc(ctx.versionLinks.get(c))}">${cell}</a>`;
        return `<td>${cell}</td>`;
      });
      return `<tr>${tds.join('')}</tr>`;
    })
    .join('');
  // A table whose columns cannot all fit a phone (five or more, or long text in every column) keeps readable columns and
  // scrolls inside its own box, which takes focus so it can be scrolled from the keyboard too. The rest wrap to fit, so a
  // short table like the joker chances shows its last column (the chance) without scrolling.
  const longest = t.head.map((h, j) => Math.max(h.length, ...t.rows.map((r) => r[j].length)));
  const wide = t.head.length >= 5 || (t.head.length >= 4 && longest.reduce((a, b) => a + b, 0) > 120);
  const label = wide ? ` role="region" tabindex="0" aria-label="${esc(ctx.lastHeading || '표')}"` : '';
  return `<div class="md-table${wide ? ' md-table--wide' : ''}"${label}><table>${head}<tbody>${body}</tbody></table></div>`;
}

function renderToc(heads) {
  const tree = [];
  for (const h of heads) {
    if (h.level === 3 && tree.length) tree.at(-1).kids.push(h);
    else tree.push({ h, kids: [] });
  }
  const link = (h) => `<a href="#${esc(h.id)}">${h.html}</a>`;
  const items = tree.map(({ h, kids }) => `<li>${link(h)}${kids.length ? `<ol>${kids.map((k) => `<li>${link(k)}</li>`).join('')}</ol>` : ''}</li>`);
  return `<details class="md-toc"><summary>목차</summary><ol>${items.join('')}</ol></details>`;
}

/** The text of one version of a document as the inside of <main>. */
function renderDoc(cfg, pg) {
  const { doc, version, current } = pg;
  const file = snapshotPath(doc, version.version);
  const md = readFileSync(file, 'utf8');
  const blocks = parseBlocks(md, show(file));
  if (blocks[0]?.type !== 'h' || blocks[0].level !== 1) throw new Error(`${show(file)}: 첫 줄이 '# 제목'이 아님`);
  const ctx = { values: valuesFor(cfg, version), missing: [], ids: new Set(), lastH2: '', lastHeading: '', versionLinks: new Map() };
  const newest = doc.versions.at(-1).version;
  for (const v of doc.versions) {
    if (v.version === version.version) continue;
    if (v.version === newest) ctx.versionLinks.set(v.version, `../${doc.id}`);
    else ctx.versionLinks.set(v.version, `${current ? 'archive/' : ''}${doc.id}-${v.version}.html`);
  }
  const title = blocks[0].text;
  let html = `<h1>${inline(title, ctx)}</h1>\n${renderBlocks(blocks.slice(1), ctx, { toc: true })}`;
  if (!current) html = `<p class="md-archived">이전 버전 ${esc(version.version)} · <a href="../${doc.id}">현재 버전 보기</a></p>\n${html}`;
  return { title, main: html, missing: ctx.missing, tableVersion: tableVersion(md) };
}

/** The blocks under a title as HTML. `toc` puts the contents before the first '##'; `shift` moves the headings down a level (a notice's own '##' sits under the notice's title). */
function renderBlocks(blocks, ctx, { toc = false, shift = 0 } = {}) {
  const heads = blocks.filter((b) => b.type === 'h');
  for (const h of heads) {
    h.id = headingId(h, ctx);
    h.html = inline(h.text, { ...ctx, missing: [] });
  }
  let html = '';
  let tocDone = !toc;
  for (const b of blocks) {
    if (b.type === 'h') {
      if (b.level === 2 && !tocDone) {
        html += renderToc(heads) + '\n';
        tocDone = true;
      }
      ctx.lastHeading = b.text;
      const level = Math.min(b.level + shift, 6);
      html += `<h${level} id="${esc(b.id)}">${b.html}</h${level}>\n`;
    } else if (b.type === 'p') {
      html += `<p${/^(시행일|기준일):/.test(b.text) ? ' class="md-meta"' : ''}>${inline(b.text, ctx)}</p>\n`;
    } else if (b.type === 'list') {
      html += renderList(b, ctx) + '\n';
    } else if (b.type === 'table') {
      html += renderTable(b, ctx) + '\n';
    } else if (b.type === 'quote') {
      html += `<blockquote><p>${inline(b.text, ctx)}</p></blockquote>\n`;
    } else {
      html += '<hr>\n';
    }
  }
  return html;
}

/** {사이트}/notices: every notice in full, newest first, or '공지 없음'. */
function renderNotices(cfg) {
  const ctx = { values: valuesFor(cfg), missing: [], ids: new Set(), lastH2: '', lastHeading: '', versionLinks: new Map() };
  const title = `${cfg.gameName} 공지`;
  const items = readNotices()
    .filter((n) => !n.problems.length)
    .map((n) => {
      ctx.idPrefix = `${n.id}-`;
      ctx.ids.add(n.id).add(`${n.id}-title`);
      ctx.lastH2 = '';
      const body = renderBlocks(n.blocks.slice(1), ctx, { shift: 1 });
      return [
        `<article class="md-notice" id="${esc(n.id)}" aria-labelledby="${esc(n.id)}-title">`,
        `<h2 id="${esc(n.id)}-title">${inline(n.blocks[0].text, ctx)}</h2>`,
        `<p class="md-meta"><time datetime="${n.date}">${n.date}</time></p>`,
        `${body}</article>`,
      ].join('\n');
    });
  const main = [
    `<h1>${esc(title)}</h1>`,
    '<p class="md-meta">이용약관, 확률과 상품 구성, 개인정보 처리방침의 변경과 서비스 종료 안내</p>',
    items.length ? items.join('\n') : '<p class="md-empty">공지 없음</p>',
  ].join('\n');
  return { title, main: main + '\n', missing: ctx.missing };
}

function renderSupport(cfg) {
  const ctx = { values: valuesFor(cfg), missing: [] };
  const email = cfg.values?.['이메일'];
  const mail = filled(email) ? `<a class="md-email" href="mailto:${esc(email.trim())}">${esc(email.trim())}</a>` : inline('{{이메일}}', ctx);
  const title = `${cfg.gameName} 문의`;
  const docs = cfg.documents.map((d) => `<li><a href="${d.id}">${esc(d.label)}</a></li>`).join('');
  const main = [
    `<h1>${esc(title)}</h1>`,
    `<section class="md-contact" aria-labelledby="contact"><h2 id="contact">문의 메일</h2><p>${mail}</p></section>`,
    `<section aria-labelledby="docs"><h2 id="docs">약관과 정책</h2><ul class="md-links">${docs}</ul></section>`,
  ].join('\n');
  return { title, main: main + '\n', missing: ctx.missing };
}

function shell(cfg, pg, { title, main, draft, missing }) {
  const up = pg.rel.split('/').length - 1;
  const toSite = '../'.repeat(up);
  const toRoot = '../'.repeat(up + sitePath(cfg).length);
  const here = pg.support ? 'support' : pg.notices ? 'notices' : pg.current ? pg.doc.id : null;
  const canonical = `${cfg.siteUrl}/${pg.current ? pg.rel.replace(/\.html$/, '') : pg.rel}`;
  const nav = [...cfg.documents.map((d) => [d.id, d.label]), ['notices', '공지'], ['support', '문의']]
    .map(([id, label]) => `<a href="${toSite}${id}"${id === here ? ' aria-current="page"' : ''}>${esc(label)}</a>`)
    .join('');
  const banner = draft && missing.length ? `<p class="md-draft" role="note">미리보기 · 채우지 않은 자리표시 ${missing.length}개 · 공개 배포 불가</p>\n` : '';
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
${GENERATOR_META}
${draft || !pg.current ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${esc(canonical)}">
<link rel="icon" type="image/png" href="${toRoot}assets/brand/newmeans-logo.png">
<link rel="stylesheet" href="${toRoot}base.css">
<link rel="stylesheet" href="${toSite}doc.css">
</head>
<body>
<!-- ${GENERATOR}가 만든 파일. 직접 고치지 않음: _magical-dove/의 원문 사본이나 config.json을 고친 뒤 build -->
<a class="skip-link" href="#main">본문 바로가기</a>
<header class="md-top">
<a href="${toRoot}" aria-label="NewMeans 홈"><img src="${toRoot}assets/brand/newmeans-wordmark-ink.png" alt="NewMeans" width="1250" height="170"></a>
<a href="${toSite}support"${here === 'support' ? ' aria-current="page"' : ''}>문의</a>
</header>
<main id="main" class="md-doc">
${banner}${main}</main>
<footer class="md-foot">
<nav aria-label="${esc(cfg.gameName)} 안내">${nav}</nav>
</footer>
</body>
</html>
`;
}

/** Every page as HTML, with the placeholders left in each. Throws on a broken source. */
function render(cfg, { draft = false } = {}) {
  return pageList(cfg).map((pg) => {
    if (pg.doc && !existsSync(snapshotPath(pg.doc, pg.version.version))) {
      return { pg, error: `원문 사본이 없음: ${show(snapshotPath(pg.doc, pg.version.version))} (sync)` };
    }
    const r = pg.support ? renderSupport(cfg) : pg.notices ? renderNotices(cfg) : renderDoc(cfg, pg);
    return { pg, ...r, html: shell(cfg, pg, { ...r, draft }) };
  });
}

function versionProblems(pages) {
  return pages
    .filter(({ pg, tableVersion: tv }) => pg.doc && tv && tv !== pg.version.version)
    .map(({ pg, tableVersion: tv }) => `${show(snapshotPath(pg.doc, pg.version.version))}: 본문의 버전 표 마지막 줄은 ${tv}인데 config.json의 버전은 ${pg.version.version}`);
}

/** Links in the text to an address under {사이트}/ that no page answers (the text names a page this site does not make yet). */
function linkProblems(cfg, pages) {
  const known = routes(cfg);
  const p = [];
  for (const r of pages.filter((x) => !x.error)) {
    const prefix = `href="${esc(cfg.siteUrl)}/`;
    for (const part of r.html.split(prefix).slice(1)) {
      const path = part.slice(0, part.indexOf('"')).replace(/#.*$/, '');
      if (!known.has(path)) p.push(`${r.pg.rel}: 본문이 없는 페이지를 가리킴: ${cfg.siteUrl}/${path}`);
    }
  }
  return [...new Set(p)];
}

function generatedOnDisk(dir) {
  const found = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const f = join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (e.name.endsWith('.html') && readFileSync(f, 'utf8').includes(GENERATOR_META)) found.push(relative(dir, f).split(sep).join('/'));
    }
  };
  walk(dir);
  return found;
}

// ---------- 명령 ----------

function printTodo(todo) {
  const group = (list) => {
    const by = new Map(); // {{자리}} → file → lines
    for (const t of list) {
      const files = by.get(t.raw) ?? new Map();
      files.set(t.file, [...(files.get(t.file) ?? []), t.line]);
      by.set(t.raw, files);
    }
    return [...by].flatMap(([raw, files]) => [`  ${raw}`, ...[...files].map(([f, lines]) => `      ${f}:${lines.join(', ')}`)]);
  };
  const confirm = todo.filter((t) => t.name === '' || t.name.startsWith('확인:'));
  const fill = todo.filter((t) => !confirm.includes(t));
  if (fill.length) console.log(['채우지 않은 자리표시 (config.json의 values):', ...group(fill)].join('\n'));
  if (confirm.length) console.log(['확인할 자리 ({{확인: …}}, 빈 {{ }}):', ...group(confirm)].join('\n'));
}

function check(cfg) {
  const problems = configProblems(cfg);
  if (problems.length) return finish(problems);
  const dir = siteDir(cfg);
  const pages = render(cfg);
  problems.push(...pages.filter((r) => r.error).map((r) => r.error), ...versionProblems(pages), ...linkProblems(cfg, pages));
  problems.push(...readNotices().flatMap((n) => n.problems));
  const todo = unfilled(cfg);
  if (todo.length) {
    printTodo(todo);
    problems.push(`자리표시 ${todo.length}개가 남아 공개 페이지를 만들지 않음`);
  } else {
    for (const r of pages.filter((x) => !x.error)) {
      const file = join(dir, r.pg.rel);
      if (!existsSync(file)) problems.push(`${show(file)}이 없음 (build)`);
      else if (readFileSync(file, 'utf8') !== r.html) problems.push(`${show(file)}이 원문이나 설정과 다름 (build)`);
    }
  }
  const expected = new Set(pages.map((r) => r.pg.rel));
  for (const rel of generatedOnDisk(dir)) if (!expected.has(rel)) problems.push(`만들지 않는 페이지가 남아 있음: ${show(join(dir, rel))} (build가 지움)`);
  return finish(problems);
}

function finish(problems) {
  if (!problems.length) {
    console.log('검사 통과');
    return 0;
  }
  console.log(['', '문제:', ...problems.map((p) => `  - ${p}`)].join('\n'));
  return 1;
}

function build(cfg) {
  const problems = configProblems(cfg);
  if (problems.length) return finish(problems);
  const pages = render(cfg);
  problems.push(...pages.filter((r) => r.error).map((r) => r.error), ...versionProblems(pages), ...linkProblems(cfg, pages));
  problems.push(...readNotices().flatMap((n) => n.problems));
  const todo = unfilled(cfg);
  if (todo.length) {
    printTodo(todo);
    problems.push(`자리표시 ${todo.length}개가 남아 공개 폴더에 아무것도 쓰지 않음`);
  }
  if (problems.length) return finish(problems);
  const dir = resolve(arg('out', siteDir(cfg)));
  const expected = new Set(pages.map((r) => r.pg.rel));
  for (const rel of generatedOnDisk(dir)) {
    if (!expected.has(rel)) {
      rmSync(join(dir, rel));
      console.log(`지움 ${show(join(dir, rel))}`);
    }
  }
  for (const r of pages) {
    const file = join(dir, r.pg.rel);
    mkdirSync(dirname(file), { recursive: true });
    const same = existsSync(file) && readFileSync(file, 'utf8') === r.html;
    if (!same) writeFileSync(file, r.html);
    console.log(`${same ? '그대로' : '씀'} ${show(file)}  →  ${cfg.siteUrl}/${r.pg.current ? r.pg.rel.replace(/\.html$/, '') : r.pg.rel}`);
  }
  return 0;
}

/** The text to keep from a source file: without the note at the top ('>' lines under the title) and, when the document says so, without what follows a '---' line. */
function stripMemos(raw, doc) {
  const lines = raw.replace(/\r\n?/g, '\n').split('\n');
  if (!/^# /.test(lines[0])) throw new Error(`${doc.file}: 첫 줄이 '# 제목'이 아님`);
  const removed = [];
  let i = 1;
  while (i < lines.length && !lines[i].trim()) i++;
  if (/^>/.test(lines[i] ?? '')) {
    const from = i;
    while (i < lines.length && /^>/.test(lines[i])) i++;
    removed.push(`${from + 1}-${i}줄 (맨 위 인용 블록)`);
    while (i < lines.length && !lines[i].trim()) i++;
  }
  let body = lines.slice(i);
  const rule = body.findIndex((l) => RULE.test(l));
  if (rule >= 0) {
    if (!doc.memoAfterRule) throw new Error(`${doc.file}: '---' 줄이 있음(${i + rule + 1}줄). 그 뒤가 게시하지 않는 메모면 config.json의 이 문서에 "memoAfterRule": true`);
    const heading = body.slice(rule).find((l) => /^#/.test(l)) ?? '';
    removed.push(`${i + rule + 1}-${lines.length}줄 ('---' 뒤${heading ? `, ${heading.replace(/^#+\s*/, '')}` : ''})`);
    body = body.slice(0, rule);
  } else if (doc.memoAfterRule) {
    console.log(`  주의: ${doc.file}에 memoAfterRule이 있는데 '---' 줄이 없음`);
  }
  while (body.length && !body.at(-1).trim()) body.pop();
  return { text: [lines[0], '', ...body].join('\n') + '\n', removed };
}

function sync(cfg) {
  const repo = resolve(arg('repo', join(ROOT, '..', 'Magical-Dove')));
  const ref = arg('ref', 'origin/main');
  const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 16 << 20 });
  const commit = git('rev-parse', `${ref}^{commit}`).trim();
  const record = { ref, commit, files: {} };
  let failed = false;
  console.log(`원문: ${repo} ${ref} (${commit.slice(0, 12)})`);
  for (const doc of cfg.documents) {
    const path = `docs/store/${doc.file}`;
    let raw;
    try {
      raw = git('show', `${ref}:${path}`);
    } catch {
      console.log(`  ${doc.file}: ${ref}에 없음`);
      failed = true;
      continue;
    }
    const latest = doc.versions.at(-1).version;
    const { text, removed } = stripMemos(raw, doc);
    const tv = tableVersion(text);
    if (tv && tv !== latest) {
      console.log(`  ${doc.file}: 원문의 버전 표 마지막 줄은 ${tv}, config.json의 ${doc.id} 최신 버전은 ${latest}. 개정이면 versions 끝에 {"version": "${tv}"}를 더한 뒤 다시 sync (쓰지 않음)`);
      failed = true;
      continue;
    }
    const target = snapshotPath(doc, latest);
    const before = existsSync(target) ? readFileSync(target, 'utf8') : null;
    mkdirSync(dirname(target), { recursive: true });
    if (before !== text) writeFileSync(target, text);
    record.files[doc.file] = git('rev-parse', `${ref}:${path}`).trim();
    const state = before === null ? '새로 씀' : before === text ? '같음' : '바뀜';
    console.log(`  ${doc.file} → ${show(target)}: ${state}${removed.length ? `, 뺀 메모 ${removed.join(', ')}` : ''}`);
    const published = join(siteDir(cfg), `${doc.id}.html`);
    if (state === '바뀜' && existsSync(published)) console.log(`    주의: 이미 게시한 버전 ${latest}의 본문이 바뀜. 개정이면 새 버전으로 올렸는지 확인`);
  }
  writeFileSync(join(HERE, 'source', 'source.json'), JSON.stringify(record, null, 2) + '\n');
  return failed ? 1 : 0;
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.otf': 'font/otf', '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4', '.wav': 'audio/wav',
};

/** A local stand-in for GitHub Pages' path lookup: a folder → '/' redirect, 'x' → 'x.html', and Jekyll's hiding of '_' and '.' names. Nothing is kept in the browser's cache, so an edit shows on reload. */
function serve(cfg) {
  const port = Number(arg('port', 8765));
  const draft = flag('draft');
  const prefix = `/${sitePath(cfg).join('/')}/`;
  const server = createServer((req, res) => {
    const head = { 'Cache-Control': 'no-cache' };
    const send = (status, body, type, extra = {}) => {
      res.writeHead(status, { ...head, 'Content-Type': type, ...extra });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    const notFound = () => send(404, existsSync(join(ROOT, '404.html')) ? readFileSync(join(ROOT, '404.html')) : 'Not Found', 'text/html; charset=utf-8');
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, '', 'text/plain', { Allow: 'GET, HEAD' });
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      return send(400, '', 'text/plain');
    }
    const segs = path.split('/').filter(Boolean);
    if (segs.some((s) => s === '..' || s.startsWith('_') || s.startsWith('.'))) return notFound();
    if (draft && path.startsWith(prefix)) {
      const rel = path.slice(prefix.length);
      const want = extname(rel) ? rel : `${rel}.html`;
      try {
        const hit = render(cfg, { draft: true }).find((r) => r.pg.rel === want && !r.error);
        if (hit) return send(200, hit.html, MIME['.html']);
      } catch (e) {
        return send(500, String(e.message), 'text/plain; charset=utf-8');
      }
    }
    let file = join(ROOT, ...segs);
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!path.endsWith('/')) return send(301, '', 'text/html', { Location: `${path}/` });
      file = join(file, 'index.html');
    } else if (!existsSync(file) && existsSync(`${file}.html`)) {
      file = `${file}.html`;
    }
    if (!existsSync(file) || statSync(file).isDirectory()) return notFound();
    send(200, readFileSync(file), MIME[extname(file).toLowerCase()] ?? 'application/octet-stream');
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`http://localhost:${port}${prefix}support${draft ? '  (미리보기: 남은 자리표시를 표시함)' : ''}`);
  });
}

const commands = { check, build, sync, serve };
const cmd = process.argv[2];
if (!commands[cmd]) {
  console.log('쓰는 법: node _magical-dove/pages.mjs check | build | sync | serve  (README의 매지컬 비둘기 스토어 페이지)');
  process.exit(2);
}
try {
  const code = commands[cmd](readConfig());
  if (typeof code === 'number') process.exitCode = code;
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
