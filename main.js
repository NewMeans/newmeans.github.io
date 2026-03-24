const ASSET_PATHS = {
  poster: "NewMeans Web Assets/Screenshots/IMG_3496.PNG",
  desk: {
    keyNormal: "NewMeans Web Assets/DeskImages/keycap_0.png",
    keyWide: "NewMeans Web Assets/DeskImages/keycap_1.png"
  },
  screenshots: {
    customization: "NewMeans Web Assets/Screenshots/IMG_3497.PNG",
    gameplayOne: "NewMeans Web Assets/Screenshots/IMG_7203.PNG",
    gameplayTwo: "NewMeans Web Assets/Screenshots/IMG_7204.PNG",
    gameplayThree: "NewMeans Web Assets/Screenshots/IMG_7206.PNG"
  }
};

const VISUAL_KEY_LAYOUT = [
  [
    { label: "W", value: "W", span: 1 },
    { label: "E", value: "E", span: 1 },
    { label: "R", value: "R", span: 1 },
    { label: "'", value: "Apostrophe", span: 1 },
    { label: "M", value: "M", span: 1 },
    { label: "K", value: "K", span: 2, wide: true }
  ],
  [
    { label: "A", value: "A", span: 2, wide: true },
    { label: "I", value: "I", span: 1 },
    { label: "N", value: "N", span: 1 },
    { label: "G", value: "G", span: 1 },
    { label: "T", value: "T", span: 1 },
    { label: "H", value: "H", span: 1 }
  ],
  [
    { label: "S", value: "S", span: 1 },
    { label: "O", value: "O", span: 1 },
    { label: "U", value: "U", span: 1 },
    { label: "D", value: "D", span: 1 },
    { label: "L", value: "L", span: 1 },
    { label: "Y", value: "Y", span: 2, wide: true }
  ]
];

const TYPER_SLIDES = [
  {
    src: ASSET_PATHS.screenshots.customization,
    label: "Desk customization",
    alt: "Typer desk customization screen with different keyboard themes."
  },
  {
    src: ASSET_PATHS.screenshots.gameplayOne,
    label: "Gameplay view one",
    alt: "Typer gameplay screen with numbered blocks and a monitor score display."
  },
  {
    src: ASSET_PATHS.screenshots.gameplayTwo,
    label: "Gameplay view two",
    alt: "Typer gameplay screen with blue blocks and multiple moving projectiles."
  },
  {
    src: ASSET_PATHS.screenshots.gameplayThree,
    label: "Gameplay view three",
    alt: "Typer gameplay screen with purple blocks and dense projectile trails."
  }
];

const AUDIO_CONFIG = {
  bgm: "NewMeans Web Assets/BGMs/Vintage Needle.mp3",
  keySounds: Array.from({ length: 10 }, (_, index) => `NewMeans Web Assets/KeySounds/${index}.wav`),
  bgmVolume: 0.22,
  keyVolume: 0.46
};

const TERMINAL_CONFIG = {
  maxStoredLines: 18,
  desktopVisibleLines: 7,
  mobileVisibleLines: 5
};

document.addEventListener("DOMContentLoaded", () => {
  initSlides();
  initScrollButtons();
  initHero();
});

function initHero() {
  const hero = document.querySelector("[data-hero]");
  const monitorOutput = document.querySelector("[data-monitor-output]");
  const keyboardRoot = document.querySelector("[data-keyboard]");
  const visualizerRoot = document.querySelector("[data-visualizer]");
  const soundToggle = document.querySelector("[data-sound-toggle]");
  const copyrightTrigger = document.querySelector("[data-copyright-trigger]");

  if (!hero || !monitorOutput || !keyboardRoot || !visualizerRoot || !soundToggle) {
    return;
  }

  const keyMap = buildKeyboard(keyboardRoot);
  const randomPressPool = Array.from(keyMap.keys());
  const visualizerBars = buildVisualizer(visualizerRoot, 24);
  const audio = createAudioController(soundToggle, copyrightTrigger);

  let heroVisible = true;
  let terminalBuffer = [""];
  let visualizerResetTimer = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      heroVisible = !!entry && entry.isIntersecting && entry.intersectionRatio > 0.28;
    },
    { threshold: [0, 0.28, 0.55] }
  );

  observer.observe(hero);
  resetVisualizer(visualizerBars);
  renderTerminal();
  window.addEventListener("resize", renderTerminal);

  keyboardRoot.addEventListener("pointerdown", (event) => {
    const keyButton = event.target.closest("[data-key]");
    if (!keyButton) {
      return;
    }

    const value = keyButton.dataset.keyValue;
    pressKey(value, keyMap);
    insertCharacter(screenKeyToCharacter(value));
    pulseVisualizer();
    audio.playKey();
  });

  window.addEventListener("keydown", (event) => {
    if (!heroVisible || isEditableTarget(event.target) || event.isComposing || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    const action = classifyPhysicalKey(event.key);
    if (!action) {
      return;
    }

    event.preventDefault();
    handlePhysicalAction(action);
    pressRandomVisualKey();
    pulseVisualizer();
    audio.playKey();
  });

  document.documentElement.classList.add("hero-enhanced");

  function handlePhysicalAction(action) {
    if (action.type === "newline") {
      insertNewLine();
      return;
    }

    if (action.type === "backspace") {
      removeCharacter();
      return;
    }

    insertCharacter(action.value);
  }

  function insertCharacter(character) {
    terminalBuffer[terminalBuffer.length - 1] += character;
    trimBuffer();
    renderTerminal();
  }

  function insertNewLine() {
    terminalBuffer.push("");
    trimBuffer();
    renderTerminal();
  }

  function removeCharacter() {
    const currentIndex = terminalBuffer.length - 1;
    const currentLine = terminalBuffer[currentIndex];

    if (currentLine.length > 0) {
      terminalBuffer[currentIndex] = currentLine.slice(0, -1);
      renderTerminal();
      return;
    }

    if (terminalBuffer.length > 1) {
      terminalBuffer.pop();
      renderTerminal();
    }
  }

  function trimBuffer() {
    while (terminalBuffer.length > TERMINAL_CONFIG.maxStoredLines) {
      terminalBuffer.shift();
    }
  }

  function renderTerminal() {
    const visibleLines = terminalBuffer.slice(-getVisibleLineCount());
    monitorOutput.innerHTML = "";

    visibleLines.forEach((line, index) => {
      const lineElement = document.createElement("p");
      lineElement.className = "monitor-line";
      lineElement.textContent = line;

      if (index === visibleLines.length - 1) {
        const caret = document.createElement("span");
        caret.className = "monitor-caret";
        caret.setAttribute("aria-hidden", "true");
        lineElement.appendChild(caret);
      }

      monitorOutput.appendChild(lineElement);
    });

    if (visibleLines.length === 0) {
      const emptyLine = document.createElement("p");
      emptyLine.className = "monitor-line";
      const caret = document.createElement("span");
      caret.className = "monitor-caret";
      caret.setAttribute("aria-hidden", "true");
      emptyLine.appendChild(caret);
      monitorOutput.appendChild(emptyLine);
    }
  }

  function getVisibleLineCount() {
    return window.matchMedia("(max-width: 720px)").matches
      ? TERMINAL_CONFIG.mobileVisibleLines
      : TERMINAL_CONFIG.desktopVisibleLines;
  }

  function pulseVisualizer() {
    window.clearTimeout(visualizerResetTimer);
    visualizerBars.forEach((bar) => {
      bar.style.setProperty("--bar-height", `${randomBetween(18, 86)}%`);
      bar.style.opacity = "1";
    });

    visualizerResetTimer = window.setTimeout(() => {
      resetVisualizer(visualizerBars);
    }, 140);
  }

  function pressRandomVisualKey() {
    if (randomPressPool.length === 0) {
      return;
    }

    const randomValue = randomPressPool[Math.floor(Math.random() * randomPressPool.length)];
    pressKey(randomValue, keyMap);
  }
}

function buildKeyboard(root) {
  const keyMap = new Map();
  root.innerHTML = "";

  VISUAL_KEY_LAYOUT.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = "keyboard-row";

    row.forEach((key) => {
      const button = document.createElement("button");
      const cap = document.createElement("img");
      const shine = document.createElement("span");
      const label = document.createElement("span");

      button.type = "button";
      button.className = key.wide ? "key key--wide" : "key";
      button.dataset.key = "";
      button.dataset.keyValue = key.value;
      button.style.gridColumn = `span ${key.span}`;
      button.style.setProperty("--key-ratio", key.wide ? `${461 / 281}` : "1");
      button.setAttribute("aria-label", humanizeKey(key.value));

      cap.className = "key__cap";
      cap.alt = "";
      cap.src = encodePath(key.wide ? ASSET_PATHS.desk.keyWide : ASSET_PATHS.desk.keyNormal);

      shine.className = "key__shine";

      label.className = "key__label";
      label.textContent = key.label;

      button.appendChild(cap);
      button.appendChild(shine);
      button.appendChild(label);
      rowElement.appendChild(button);
      keyMap.set(key.value, button);
    });

    root.appendChild(rowElement);
  });

  return keyMap;
}

function buildVisualizer(root, count) {
  const bars = [];
  root.innerHTML = "";

  for (let index = 0; index < count; index += 1) {
    const bar = document.createElement("span");
    bar.className = "visualizer-bar";
    bar.style.setProperty("--bar-height", `${randomBetween(10, 22)}%`);
    root.appendChild(bar);
    bars.push(bar);
  }

  return bars;
}

function resetVisualizer(bars) {
  bars.forEach((bar, index) => {
    const height = index % 6 === 0 ? randomBetween(18, 32) : randomBetween(10, 22);
    bar.style.setProperty("--bar-height", `${height}%`);
    bar.style.opacity = "0.94";
  });
}

function pressKey(value, keyMap, duration = 120) {
  const button = keyMap.get(value);
  if (!button) {
    return;
  }

  button.classList.add("is-active");
  window.clearTimeout(button._releaseTimer);
  button._releaseTimer = window.setTimeout(() => {
    button.classList.remove("is-active");
  }, duration);
}

function classifyPhysicalKey(key) {
  if (key === "Backspace") {
    return { type: "backspace" };
  }

  if (key === "Enter") {
    return { type: "newline" };
  }

  if (key.length === 1) {
    return { type: "char", value: key };
  }

  return null;
}

function screenKeyToCharacter(value) {
  if (value === "Apostrophe") {
    return "'";
  }

  return value.toLowerCase();
}

function humanizeKey(value) {
  return value === "Apostrophe" ? "Apostrophe" : value;
}

function initSlides() {
  const track = document.querySelector("[data-slide-track]");
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const images = Array.from(document.querySelectorAll("[data-slide-image]"));
  const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
  const viewer = document.querySelector("[data-device-viewer]");

  if (!track || slides.length !== TYPER_SLIDES.length || images.length !== TYPER_SLIDES.length || dots.length !== TYPER_SLIDES.length || !viewer) {
    return;
  }

  TYPER_SLIDES.forEach((slide, index) => {
    images[index].src = encodePath(slide.src);
    images[index].alt = slide.alt;
    dots[index].setAttribute("aria-label", slide.label);
  });

  let activeIndex = 0;
  let hoverTimer = 0;
  let pointerStartX = 0;

  const setActiveSlide = (index) => {
    activeIndex = (index + TYPER_SLIDES.length) % TYPER_SLIDES.length;
    track.style.transform = `translateX(${-activeIndex * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
      dot.setAttribute("aria-pressed", dotIndex === activeIndex ? "true" : "false");
    });
  };

  const stopHoverCycle = () => {
    window.clearInterval(hoverTimer);
  };

  const startHoverCycle = () => {
    if (!window.matchMedia("(hover: hover)").matches) {
      return;
    }

    stopHoverCycle();
    hoverTimer = window.setInterval(() => {
      setActiveSlide(activeIndex + 1);
    }, 2400);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopHoverCycle();
      setActiveSlide(index);
    });
  });

  viewer.addEventListener("mouseenter", startHoverCycle);
  viewer.addEventListener("mouseleave", stopHoverCycle);
  viewer.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
  });

  viewer.addEventListener("pointerup", (event) => {
    const delta = event.clientX - pointerStartX;
    if (Math.abs(delta) < 36) {
      return;
    }

    stopHoverCycle();
    setActiveSlide(activeIndex + (delta < 0 ? 1 : -1));
  });

  viewer.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    stopHoverCycle();
    setActiveSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  });

  setActiveSlide(0);
}

function initScrollButtons() {
  const target = document.getElementById("typer");
  if (!target) {
    return;
  }

  document.querySelectorAll("[data-scroll-next]").forEach((button) => {
    button.addEventListener("click", () => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function createAudioController(toggleButton, copyrightTrigger) {
  let enabled = false;
  let bgm = null;
  let keySounds = [];
  const available = typeof window.Howl === "function" && typeof window.Howler === "object";
  const label = toggleButton.querySelector(".sound-toggle__label");

  if (available) {
    bgm = new window.Howl({
      src: [encodePath(AUDIO_CONFIG.bgm)],
      loop: true,
      volume: AUDIO_CONFIG.bgmVolume,
      html5: false
    });

    keySounds = AUDIO_CONFIG.keySounds.map((sound) => new window.Howl({
      src: [encodePath(sound)],
      volume: AUDIO_CONFIG.keyVolume,
      preload: true,
      pool: 8
    }));

    window.Howler.mute(true);
  } else {
    toggleButton.disabled = true;
  }

  const updateState = () => {
    toggleButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    toggleButton.setAttribute("aria-label", enabled ? "Mute sound" : "Enable sound");
    if (label) {
      label.textContent = enabled ? "Sound On" : "Sound Off";
    }
  };

  const playRandomKey = () => {
    if (!available || !enabled || keySounds.length === 0) {
      return;
    }

    const sample = keySounds[Math.floor(Math.random() * keySounds.length)];
    sample.play();
  };

  toggleButton.addEventListener("click", () => {
    if (!available) {
      return;
    }

    enabled = !enabled;
    window.Howler.mute(!enabled);

    if (enabled) {
      if (!bgm.playing()) {
        bgm.play();
      }
    } else {
      bgm.stop();
    }

    updateState();
  });

  if (copyrightTrigger) {
    copyrightTrigger.addEventListener("click", () => {
      playRandomKey();
    });
  }

  updateState();

  return {
    playKey: playRandomKey
  };
}

function encodePath(path) {
  return encodeURI(path);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select";
}
