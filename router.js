const pages = ['index','profil','ekstra','berita','galeri','kontak'];
function qs(s){return document.querySelectorAll(s);}
async function loadView(name){
  const view = document.getElementById('view');
  if(!view) return;
  const res = await fetch('pages/'+name+'.html');
  const html = await res.text();
  view.classList.remove('enter');
  setTimeout(()=>{
    view.innerHTML = html;
    setTimeout(()=> view.classList.add('enter'), 20);
    qs('.nav a').forEach(a=> a.classList.toggle('active', a.getAttribute('data-target')===name));
    window.scrollTo({top:0,behavior:'smooth'});
  }, 220);
}
function initRouter(){
  qs('.nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = a.getAttribute('data-target');
      history.pushState({page:target},'',target==='index'? '':'#'+target);
      loadView(target);
    });
  });
  window.addEventListener('popstate', ()=>{
    const page = (location.hash && location.hash.slice(1)) || 'index';
    loadView(page);
  });
  const initial = (location.hash && location.hash.slice(1)) || 'index';
  loadView(initial);
}
function fadeAudioOut(audio, duration=600){
  if(!audio) return;
  const start = audio.volume || 1;
  const steps = 12; const stepTime = duration/steps;
  let cur = 0;
  const iv = setInterval(()=>{ cur++; const v = Math.max(0, start*(1 - cur/steps)); audio.volume = v; if(cur>=steps){ clearInterval(iv); try{ audio.pause(); }catch(e){} audio.volume = start; } }, stepTime);
}
function fadeAudioIn(audio, duration=400){
  if(!audio) return;
  const target = 1; audio.volume = 0; try{ audio.play().catch(()=>{}); }catch(e){};
  const steps = 8; const stepTime = duration/steps; let cur=0;
  const iv = setInterval(()=>{ cur++; audio.volume = Math.min(target, target*(cur/steps)); if(cur>=steps) clearInterval(iv); }, stepTime);
}
document.addEventListener('DOMContentLoaded', ()=>{
  initRouter();
  const musicBtn = document.getElementById('music-btn');
  const audio = document.getElementById('bgm');
  if(musicBtn && audio){
    musicBtn.addEventListener('click', (e)=>{ e.stopPropagation(); if(audio.paused){ fadeAudioIn(audio,400); musicBtn.innerHTML='<i class="fa-solid fa-pause"></i>'; } else { fadeAudioOut(audio,400); musicBtn.innerHTML='<i class="fa-solid fa-play"></i>'; } });
    audio.addEventListener('play', ()=> musicBtn.innerHTML='<i class="fa-solid fa-pause"></i>');
    audio.addEventListener('pause', ()=> musicBtn.innerHTML='<i class="fa-solid fa-play"></i>');
    document.addEventListener('visibilitychange', ()=>{ if(document.hidden) fadeAudioOut(audio,600); else fadeAudioIn(audio,400); });
    window.addEventListener('beforeunload', ()=>{ fadeAudioOut(audio,400); });
  }
});