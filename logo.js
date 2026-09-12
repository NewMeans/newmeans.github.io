/* The rabbit follows the pointer and reacts to petting. The wordmark stays still. */
(function(){
  'use strict';
  var W = 4268, H = 2134;
  var PARTS = [
    { id: 1, x: 1673, y: 357, w: 133, h: 400 }, { id: 2, x: 2401, y: 357, w: 133, h: 400 },
    { id: 3, x: 3383, y: 357, w: 99, h: 99 }, { id: 4, x: 1415, y: 361, w: 193, h: 392 },
    { id: 5, x: 2142, y: 361, w: 194, h: 392 }, { id: 7, x: 3501, y: 446, w: 225, h: 220 },
    { id: 8, x: 2846, y: 840, w: 403, h: 84 }, { id: 9, x: 1217, y: 842, w: 132, h: 400 },
    { id: 10, x: 2644, y: 842, w: 133, h: 400 }, { id: 11, x: 3291, y: 842, w: 132, h: 400 },
    { id: 12, x: 1477, y: 864, w: 96, h: 69 }, { id: 13, x: 1936, y: 864, w: 94, h: 69 },
    { id: 14, x: 1659, y: 887, w: 190, h: 169 }, { id: 15, x: 2127, y: 931, w: 225, h: 221 },
    { id: 16, x: 3518, y: 955, w: 187, h: 242 }, { id: 17, x: 923, y: 1192, w: 206, h: 42 },
    { id: 18, x: 2379, y: 1192, w: 205, h: 42 }, { id: 19, x: 467, y: 1232, w: 346, h: 495 },
    { id: 20, x: 1800, y: 1232, w: 464, h: 495 }, { id: 21, x: 1233, y: 1331, w: 525, h: 396 },
    { id: 22, x: 3072, y: 1331, w: 356, h: 396 }, { id: 23, x: 857, y: 1332, w: 339, h: 395 },
    { id: 24, x: 2313, y: 1332, w: 339, h: 395 }, { id: 25, x: 2686, y: 1332, w: 346, h: 395 },
    { id: 26, x: 3481, y: 1332, w: 320, h: 395 }
  ];

  var CSS = '.nmlogo{position:relative;aspect-ratio:4268/2134;touch-action:pan-y}' +
    '.nmlogo .pc{position:absolute;pointer-events:none}' +
    '.nmlogo .pc img{width:100%;height:100%;display:block}' +
    '.nmlogo .face{transform:translate(var(--look-x,0px),var(--look-y,0px));transition:transform .18s ease-out}' +
    '.nmlogo .ear{transform-origin:50% 90%;transition:transform .25s ease}' +
    '.nmlogo.is-petted .ear{transform:rotate(-5deg) translateY(3px)}' +
    '.nmlogo.is-petted .eye{transform:translate(var(--look-x,0px),var(--look-y,0px)) scaleY(.35)}' +
    '.nmlogo .face-button{position:absolute;left:28%;top:14%;width:60%;height:43%;cursor:pointer;border:0;background:none}' +
    '@media(prefers-reduced-motion:reduce){.nmlogo .face,.nmlogo .ear{transition:none}}';
  function mount(root){
    if(root.__nmMounted)return;root.__nmMounted=true;
    if(!document.getElementById('nm-logo-css')){var style=document.createElement('style');style.id='nm-logo-css';style.textContent=CSS;document.head.appendChild(style);}
    root.classList.add('nmlogo');root.setAttribute('aria-label','NewMeans');
    var faceOnly=root.hasAttribute('data-rabbit-only'),height=faceOnly?1300:H;
    root.style.aspectRatio=W+'/'+height;
    var base=root.getAttribute('data-base')||'assets/brand/logo-pieces/';
    PARTS.forEach(function(p){
      if(faceOnly&&p.id>=19)return;
      var el=document.createElement('div');el.className='pc';
      if([12,13,14].includes(p.id))el.classList.add('face');
      if([12,13].includes(p.id))el.classList.add('eye');
      if([1,2,4,5].includes(p.id))el.classList.add('ear');
      el.style.left=p.x/W*100+'%';el.style.top=p.y/height*100+'%';el.style.width=p.w/W*100+'%';el.style.height=p.h/height*100+'%';
      var img=new Image();img.src=base+'p'+p.id+'.png';img.alt='';el.appendChild(img);root.appendChild(el);
    });
    var button=document.createElement('button');button.type='button';button.className='face-button';
    if(faceOnly){button.style.top='23%';button.style.height='70%';}
    function label(){button.setAttribute('aria-label',i18n.t('home.rabbit.action'));}
    label();window.addEventListener('nm:langchange',label);root.appendChild(button);
    var timer,frame,reduce=matchMedia('(prefers-reduced-motion: reduce)');
    root.__nmPoke=function(){root.classList.add('is-petted');clearTimeout(timer);timer=setTimeout(function(){root.classList.remove('is-petted');},800);};
    button.addEventListener('click',root.__nmPoke);
    root.addEventListener('pointermove',function(e){
      if(reduce.matches||e.pointerType==='touch')return;
      var r=root.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      cancelAnimationFrame(frame);frame=requestAnimationFrame(function(){root.style.setProperty('--look-x',x*12+'px');root.style.setProperty('--look-y',y*8+'px');});
    });
    root.addEventListener('pointerleave',function(){cancelAnimationFrame(frame);root.style.setProperty('--look-x','0px');root.style.setProperty('--look-y','0px');});
  }
  function auto(){document.querySelectorAll('[data-newmeans-logo]').forEach(mount);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',auto);else auto();
  window.NewMeansLogo={mount:mount,poke:function(root){root.__nmPoke();}};
})();
