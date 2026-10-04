'use strict';
// Installation is user-driven on iPhone. Keep this independent of game state.
(()=>{
  const status=document.getElementById('app-offline-status');
  const write=text=>{if(status)status.textContent=text;};
  if(!('serviceWorker' in navigator)||!window.isSecureContext){
    write('Offline installation needs HTTPS or localhost. Online play is still available.');return;
  }
  const observe=registration=>{
    if(registration.active)write('Ready for offline play. Open this app once from your Home Screen while online.');
    if(registration.waiting){write('Update downloaded. Close all Babar windows and reopen to use it. Your local save stays on this device.');return;}
    const installing=registration.installing;
    if(installing){
      write('Downloading the game for offline play (about 61 MB). Keep this window open.');
      installing.addEventListener('statechange',()=>{
        if(installing.state==='installed'){
          write(registration.active?'Update downloaded. Close all Babar windows and reopen to use it.':'Ready for offline play. Open this app once from your Home Screen while online.');
        }else if(installing.state==='redundant')write('Offline download did not finish. Reopen while online to retry; you can still play online.');
      });
    }
  };
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>{
      observe(reg);reg.addEventListener('updatefound',()=>observe(reg));
    }).catch(()=>write('Offline storage is unavailable. You can still play online; reopen while online to retry.'));
  });
})();
