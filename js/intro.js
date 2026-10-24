/* Show the cinematic arrival on every visit to the home page. */
(function(){
 if(document.body.dataset.page!=='home')return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const intro=document.createElement('div');intro.className='cinematic-intro'+(reduced?' reduced':'');intro.setAttribute('role','dialog');intro.setAttribute('aria-label','Cipher Nexus opening sequence');intro.setAttribute('aria-modal','true');
 intro.innerHTML='<div class="intro-stars" aria-hidden="true"></div><div class="intro-copy"><p class="eyebrow">A SIGNAL FROM BEYOND</p><img class="intro-logo" src="logo.svg" alt="Cipher Nexus portal logo"><p class="intro-name">CIPHER <span>NEXUS</span></p><p class="intro-line">Every world begins with a signal.</p></div><button class="intro-skip" type="button">'+(reduced?'Enter site':'Skip intro')+' <span aria-hidden="true">&gt;</span></button>';
 document.body.append(intro);
 let closed=false;function close(){if(closed)return;closed=true;intro.classList.add('intro-out');setTimeout(()=>intro.remove(),650)}
 intro.querySelector('button').addEventListener('click',close);
 const onKey=e=>{if(e.key==='Escape'){close();removeEventListener('keydown',onKey)}};addEventListener('keydown',onKey);
 setTimeout(close,reduced?1200:5200);
})();
