/* Official store badge localization. */
(function(){
  'use strict';
  function badges(){
    var lang=document.documentElement.lang==='ko'?'ko':'en';
    document.querySelectorAll('[data-store]').forEach(function(img){
      img.src='assets/badges/'+img.dataset.store+'-'+lang+'.svg';
      img.alt=img.dataset.store==='app-store'?(lang==='ko'?'App Store에서 다운로드':'Download on the App Store'):(lang==='ko'?'Google Play에서 다운로드':'Get it on Google Play');
    });
  }
  window.addEventListener('nm:langchange',badges);badges();
})();
