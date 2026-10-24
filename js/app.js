/* Cipher Nexus Arcade: four games, one engine. */
(()=>{
const W=960,H=480,$=id=>document.getElementById(id),cv=$('cv'),ctx=cv.getContext('2d'),ov=$('ov'),go=$('go');
const R=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const keys=new Set(),tap=new Set(),fx=[],GK=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '];
let s={},state='menu',cur=0,score=0,shake=0,time=0,sound=true,AC=null,best={};
try{best=JSON.parse(localStorage.getItem('cn-arcade')||'{}')||{}}catch(_){best={}}
const save=()=>{try{localStorage.setItem('cn-arcade',JSON.stringify(best))}catch(_){}};
function beep(f,d=.08,t='square',v=.035){if(!sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+d)}catch(_){}}
const consume=(...k)=>k.some(x=>tap.delete(x)),down=(...k)=>k.some(x=>keys.has(x));
const hx=()=>(down('ArrowRight','d')?1:0)-(down('ArrowLeft','a')?1:0),vy=()=>(down('ArrowDown','s')?1:0)-(down('ArrowUp','w')?1:0);
const add=n=>{score+=n};
function burst(x,y,c,n=14){window.CNBG&&CNBG.pulse(.35);for(let i=0;i<n;i++)fx.push({x,y,vx:R(-220,220),vy:R(-220,220),l:R(.3,.7),m:.7,c})}
const stars=Array.from({length:90},(_,i)=>({x:(i*83)%W,y:(i*137)%H,z:1+i%3,c:i%7?'#bdeaff':'#ff2e97'}));
function bg(top,acc,vert){ctx.fillStyle=top;ctx.fillRect(0,0,W,H);stars.forEach(a=>{ctx.globalAlpha=.3+a.z*.15;ctx.fillStyle=a.c;const x=vert?a.x:(a.x-time*a.z*18+W*9)%W,y=vert?(a.y+time*a.z*30)%H:a.y;ctx.fillRect(x,y,a.z*.8,a.z*.8)});ctx.globalAlpha=.12;ctx.fillStyle=acc;ctx.fillRect(0,0,W,3);ctx.globalAlpha=1}
const gl=(c,b=16)=>{ctx.shadowColor=c;ctx.shadowBlur=b;ctx.fillStyle=c},ng=()=>{ctx.shadowBlur=0};
function ship(x,y,c,r=0){ctx.save();ctx.translate(x,y);ctx.rotate(r);gl(c,18);ctx.beginPath();ctx.moveTo(0,-21);ctx.lineTo(16,15);ctx.lineTo(0,8);ctx.lineTo(-16,15);ctx.closePath();ctx.fill();ctx.restore()}
function text(t,x,y,c='#fff',sz=18,al='left'){ctx.font=sz+'px Audiowide,Arial,sans-serif';ctx.textAlign=al;ctx.fillStyle=c;ctx.fillText(t,x,y)}
function mech(x,c,face,punch,block,stun){ctx.save();ctx.translate(x,385);gl(c,stun>0?4:16);ctx.fillRect(-20,-62,40,48);ctx.fillRect(-13,-86,26,20);ctx.fillRect(-18,-14,12,14);ctx.fillRect(6,-14,12,14);ng();ctx.fillStyle='#fff';ctx.fillRect(face*5-3,-80,6,6);gl(c,10);ctx.fillRect(face>0?18:-18-(26+punch*60),-48,26+punch*60,10);ctx.beginPath();ctx.arc(face*(30+punch*60),-43,9,0,7);ctx.fill();ng();if(block){ctx.strokeStyle='#00f0ff';ctx.lineWidth=5;ctx.shadowColor='#00f0ff';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,-40,52,face>0?-1.1:Math.PI-1.1,face>0?1.1:Math.PI+1.1);ctx.stroke();ng()}ctx.restore()}

const games=[
{id:'runner',name:'Signal Runner',tag:'Arcade shooter',hex:'#ff2e97',lbl:'hits',
 desc:'Survive the signal fracture for one minute. Shoot the shards before they reach your hull. You have three lives, and the shards speed up as you score.',
 ctrl:'A / D or ← → to move, Space to fire',pad:[['←','ArrowLeft'],['→','ArrowRight'],['Fire',' ']],
 init(){s={x:W/2,shots:[],foes:[],cd:0,sp:.5,lives:3,inv:0,time:60}},
 hud:()=>{const left=Math.max(0,Math.ceil(s.time));return 'Hull '+'♥'.repeat(Math.max(0,s.lives))+' · '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0')},
 update(dt){s.time-=dt;if(s.time<=0){s.time=0;end(true,'You held the line for one minute.');return}
  s.x=clamp(s.x+hx()*360*dt,24,W-24);s.cd-=dt;s.inv-=dt;
  if(down(' ','ArrowUp','w')&&s.cd<=0){s.shots.push({x:s.x,y:395});s.cd=.2;beep(880,.04)}
  s.shots.forEach(a=>a.y-=640*dt);s.shots=s.shots.filter(a=>a.y>-20);
  if((s.sp-=dt)<=0){s.sp=Math.max(.26,.85-score*.01);s.foes.push({x:R(30,W-30),y:-20,r:R(10,17),v:R(110,190)+score*2.5})}
  for(let i=s.foes.length-1;i>=0;i--){const f=s.foes[i];f.y+=f.v*dt;if(f.y>H+20){s.foes.splice(i,1);continue}
   if(s.inv<=0&&Math.hypot(f.x-s.x,f.y-420)<f.r+13){burst(f.x,f.y,'#ff2e97',20);s.foes.splice(i,1);s.lives--;s.inv=1.3;shake=12;beep(120,.25,'sawtooth');if(s.lives<=0){end(false,'The fracture swallowed your runner.');return}continue}
   for(let j=s.shots.length-1;j>=0;j--)if(Math.hypot(f.x-s.shots[j].x,f.y-s.shots[j].y)<f.r+5){burst(f.x,f.y,'#ffe45c',10);s.foes.splice(i,1);s.shots.splice(j,1);add(1);beep(660,.05);break}}},
 draw(){bg('#09021d','#ff2e97',true);s.shots.forEach(a=>{gl('#ffe45c',12);ctx.fillRect(a.x-2,a.y-9,4,14)});s.foes.forEach(f=>{gl('#ff2e97',14);ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,7);ctx.fill()});ng();if(s.inv<=0||Math.floor(time*20)%2)ship(s.x,420,'#00f0ff')}},

{id:'arena',name:'Last Light Arena',tag:'Survival chase',hex:'#00f0ff',lbl:'cores',
 desc:'Rival runners hunt you through the last bright place in the Void. Grab 15 energy cores to secure the arena. Dash through danger.',
 ctrl:'WASD or arrow keys to move, Space to dash',pad:[['←','ArrowLeft'],['↑','ArrowUp'],['↓','ArrowDown'],['→','ArrowRight'],['Dash',' ']],
 init(){s={x:480,y:300,r:0,bots:[{x:80,y:70},{x:880,y:80}],core:{x:480,y:110},dash:0,dcd:0}},
 hud:()=>'Rivals '+s.bots.length+(s.dcd>0?' · dash '+s.dcd.toFixed(1)+'s':' · dash ready'),
 update(dt){let dx=hx(),dy=vy();const l=Math.hypot(dx,dy)||1;if(dx||dy)s.r=Math.atan2(dx,-dy);s.dcd-=dt;s.dash-=dt;
  if(consume(' ')&&s.dcd<=0){s.dash=.18;s.dcd=1.4;beep(300,.12,'sawtooth')}
  const sp=250*(s.dash>0?2.6:1);s.x=clamp(s.x+dx/l*sp*dt,24,W-24);s.y=clamp(s.y+dy/l*sp*dt,40,H-24);
  for(let i=0;i<s.bots.length;i++){const b=s.bots[i],ax=s.x-b.x,ay=s.y-b.y,d=Math.hypot(ax,ay)||1,v=(95+score*5+i*8)*dt;b.x+=ax/d*v;b.y+=ay/d*v;
   if(d<27&&s.dash<=0){burst(s.x,s.y,'#fff',24);shake=14;end(false,'A rival caught you.');return}}
  if(Math.hypot(s.x-s.core.x,s.y-s.core.y)<26){add(1);burst(s.core.x,s.core.y,'#00f0ff',16);beep(740,.08,'triangle');
   if(score>=15){end(true,'Arena secured. All 15 cores are yours.');return}
   if(score%3===0&&s.bots.length<6){const e=Math.random()<.5;s.bots.push({x:e?30:W-30,y:R(60,H-30)})}
   let n;do{n={x:R(60,W-60),y:R(70,H-50)}}while(Math.hypot(n.x-s.x,n.y-s.y)<180);s.core=n}},
 draw(){bg('#08031a','#00f0ff');const p=1+Math.sin(time*3)*.03;ctx.strokeStyle='#9d4dff99';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(W/2,H/2+10,W/2*.94*p,H/2*.9*p,0,0,7);ctx.stroke();
  s.bots.forEach((b,i)=>{const c=i%2?'#ff2e97':'#ffe45c';gl(c,14);ctx.beginPath();ctx.arc(b.x,b.y,14,0,7);ctx.fill();ng();ctx.fillStyle='#10031f';ctx.fillRect(b.x-6,b.y-3,4,4);ctx.fillRect(b.x+2,b.y-3,4,4)});
  gl('#00f0ff',22);ctx.save();ctx.translate(s.core.x,s.core.y);ctx.rotate(time*2);ctx.fillRect(-9,-9,18,18);ctx.restore();ng();
  if(s.dash>0){ctx.globalAlpha=.4;ship(s.x,s.y+14,'#00f0ff',s.r);ctx.globalAlpha=1}ship(s.x,s.y,'#fff',s.r);ng()}},

{id:'ember',name:'Ember Run',tag:'Endless runner',hex:'#ffe45c',lbl:'metres',
 desc:'The sun has gone quiet. Race across the ashlands and hop the wreckage. Survive 60 seconds to cross. Hold jump for a higher leap.',
 ctrl:'Space, W or ↑ to jump',pad:[['Jump',' ']],
 init(){s={y:0,v:0,ground:true,obs:[],dist:0,next:420,t:0,buf:0}},
 hud:()=>'Time '+Math.max(0,60-s.t).toFixed(0)+'s left',
 update(dt){s.t+=dt;const sp=300+s.t*3;if(consume(' ','w','ArrowUp'))s.buf=.12;s.buf-=dt;
  if(s.buf>0&&s.ground){s.v=780;s.ground=false;s.buf=0;beep(520,.08,'triangle')}
  s.v-=(down(' ','w','ArrowUp')&&s.v>0?2200:3400)*dt;s.y+=s.v*dt;if(s.y<=0){s.y=0;s.v=0;s.ground=true}
  s.dist+=sp*dt;score=Math.floor(s.dist/20);
  if((s.next-=sp*dt)<=0){s.obs.push({x:W+40,w:R(22,42),h:R(26,62)});s.next=R(340,560)+sp*.3}
  s.obs.forEach(o=>o.x-=sp*dt);s.obs=s.obs.filter(o=>o.x>-60);
  for(const o of s.obs)if(o.x<168&&o.x+o.w>140&&s.y<o.h-4){burst(154,385-s.y,'#ff7b52',26);shake=14;end(false,'The wreckage stopped your run.');return}
  if(s.t>=60)end(true,'You crossed the ashlands.');if(Math.random()<.3)fx.push({x:W,y:R(120,400),vx:-R(200,500),vy:R(-40,20),l:1.6,m:1.6,c:'#ffb04a'})},
 draw(){bg('#160b20','#ffe45c');ctx.fillStyle='#ffb04a';ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(700,250,70,0,7);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle='#38223c';ctx.beginPath();ctx.moveTo(0,H);for(let x=0;x<=W;x+=40)ctx.lineTo(x,310+Math.sin((x+s.dist*.2)*.012)*26);ctx.lineTo(W,H);ctx.fill();
  ctx.fillStyle='#a85d43';ctx.fillRect(0,405,W,75);ctx.fillStyle='#ffe45c';for(let x=-((s.dist)%80);x<W;x+=80)ctx.fillRect(x,430,36,3);
  s.obs.forEach(o=>{gl('#ff7b52',10);ctx.fillRect(o.x,405-o.h,o.w,o.h);ng();ctx.fillStyle='#ffe45c';ctx.fillRect(o.x+4,405-o.h+6,4,4)});
  gl('#00f0ff',18);ctx.fillRect(140,375-s.y,28,30);ng();ctx.fillStyle='#10031f';ctx.fillRect(157,383-s.y,6,6)}},

{id:'duel',name:'Iron Clash',tag:'Mech duel',hex:'#9d4dff',lbl:'points',
 desc:'One rival mech, five hits each. Punch when you are in range, and block when you see it wind up. Finish with more hull for bonus points.',
 ctrl:'A / D to move, Space to punch, Shift or S to block',pad:[['←','ArrowLeft'],['→','ArrowRight'],['Punch',' '],['Block','Shift']],
 init(){s={px:260,ex:700,ph:5,eh:5,pcd:0,pa:0,ea:0,wind:0,ecd:1.4,stun:0,blk:false}},
 hud:()=>'You '+'♥'.repeat(s.ph)+'   Rival '+'♥'.repeat(s.eh),
 update(dt){s.blk=down('Shift','s','ArrowDown');s.px=clamp(s.px+hx()*(s.blk?90:240)*dt,70,880);s.pcd-=dt;s.pa-=dt;s.ea-=dt;
  if(consume(' ','z','x')&&s.pcd<=0&&!s.blk){s.pcd=.4;s.pa=.2;beep(240,.06,'sawtooth');
   if(s.ex-s.px<125){s.eh--;s.stun=.45;s.wind=0;s.ex+=34;add(100);burst(s.ex-20,330,'#fff',12);shake=8;beep(180,.12,'square');if(s.eh<=0){add(200*s.ph);end(true,'Rival down with '+s.ph+' hull left.');return}}}
  if(s.stun>0)s.stun-=dt;else{const d=s.ex-s.px;
   if(s.wind>0){s.wind-=dt;if(s.wind<=0){s.ea=.2;if(d<130){if(s.blk){burst(s.px+40,330,'#00f0ff',12);beep(900,.08,'triangle')}else{s.ph--;shake=12;burst(s.px,330,'#ff2e97',16);beep(110,.2,'sawtooth');if(s.ph<=0){end(false,'Your mech was crushed.');return}}}s.ecd=R(.7,1.3)}}
   else{s.ecd-=dt;if(d>105)s.ex-=150*dt;else if(d<75)s.ex+=110*dt;if(s.ecd<=0&&d<120)s.wind=.5}}
  s.ex=clamp(s.ex,0,890);s.px=Math.min(s.px,s.ex-58)},
 draw(){bg('#09021d','#9d4dff');ctx.strokeStyle='#9d4dff88';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(W/2,392,400,40,0,0,7);ctx.stroke();
  if(s.wind>0){ctx.fillStyle='#ff2e97';ctx.globalAlpha=.4+.4*Math.sin(time*40);ctx.fillRect(s.ex-24,290,48,8);ctx.globalAlpha=1}
  mech(s.px,'#00f0ff',1,Math.max(0,s.pa)/.2,s.blk,0);mech(s.ex,'#ff2e97',-1,Math.max(0,s.ea)/.2,false,s.stun);
  text('You',s.px,280,'#fff',14,'center');text('Rival',s.ex,280,'#fff',14,'center')}}
];

function size(){const d=Math.min(devicePixelRatio||1,2),r=cv.getBoundingClientRect();cv.width=Math.max(1,Math.round(r.width*d));cv.height=Math.max(1,Math.round(r.height*d))}
function show(t,d,b,lock){$('ot').textContent=t;$('od').textContent=d;$('oc').textContent=games[cur].ctrl;go.textContent=b;ov.hidden=false;if(lock){go.disabled=true;setTimeout(()=>go.disabled=false,700)}}
function rank(){const t=games.reduce((a,g)=>a+(best[g.id]||0),0),r=[[1,'Unranked'],[150,'Static'],[500,'Signal runner'],[1000,'Wayfinder'],[1800,'Meridian ace'],[1e9,'Nexus legend']].find(x=>t<x[0]);$('rank').textContent=r[1]+' ('+t+')'}
function cabs(){$('rail').innerHTML=games.map((g,i)=>'<button class="cab" role="tab" data-i="'+i+'" style="--c:'+g.hex+'" aria-selected="'+(i===cur)+'"><h3>'+g.name+'</h3><p>'+g.tag+'</p><div class="hi">Best: '+(best[g.id]||0)+' '+g.lbl+'</div></button>').join('');rank()}
function pick(i){dispatchEvent(new Event('cn:reset'));cur=i;state='menu';const g=games[i];g.init();score=0;fx.length=0;shake=0;keys.clear();tap.clear();
 document.documentElement.style.setProperty('--edge',g.hex);$('mq').textContent=g.name;
 $('pad').innerHTML=g.pad.map(p=>'<button type="button" data-k="'+p[1]+'">'+p[0]+'</button>').join('');cabs();show(g.name,g.desc,'Start game')}
function start(){if(state==='play'||go.disabled)return;go.blur();dispatchEvent(new Event('cn:reset'));if(state==='pause'){state='play';ov.hidden=true;return}games[cur].init();fx.length=0;score=0;keys.clear();tap.clear();state='play';ov.hidden=true;beep(440,.1)}
function pause(){if(state==='play'){state='pause';keys.clear();show('Paused','Your run is waiting.','Resume')}else if(state==='pause')start()}
function end(win,msg){state='over';const g=games[cur],nb=score>(best[g.id]||0);if(nb){best[g.id]=score;save()}keys.clear();beep(win?880:110,.4,win?'triangle':'sawtooth');cabs();show(win?'Victory':'Game over',msg+' You scored '+score+' '+g.lbl+(nb?'. New best!':'.'),'Play again',true);window.CNBG&&CNBG.pulse(1);dispatchEvent(new CustomEvent('cn:over',{detail:{id:g.id,score,win}}))}

addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(state==='play'&&GK.includes(k))e.preventDefault();
 if(k==='p'||k==='Escape'){pause();return}
 if(state!=='play'&&(k===' '||k==='Enter')){e.preventDefault();start();return}
 if(!e.repeat)tap.add(k);keys.add(k)});
addEventListener('keyup',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(state==='play'&&GK.includes(k))e.preventDefault();keys.delete(k)});
addEventListener('blur',()=>keys.clear());addEventListener('resize',size);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pause()});
go.addEventListener('click',start);
$('rail').addEventListener('click',e=>{const b=e.target.closest('.cab');if(b)pick(+b.dataset.i)});
$('mute').addEventListener('click',e=>{sound=!sound;e.currentTarget.textContent=sound?'Sound on':'Sound off';e.currentTarget.setAttribute('aria-pressed',!sound)});
$('pad').addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();const k=b.dataset.k;if(state!=='play'){start();return}if(!keys.has(k))tap.add(k);keys.add(k);b.classList.add('on');b.setPointerCapture(e.pointerId);const up=()=>{keys.delete(k);b.classList.remove('on')};['pointerup','pointercancel','lostpointercapture'].forEach(v=>b.addEventListener(v,up,{once:true}))});
$('pad').addEventListener('contextmenu',e=>e.preventDefault());

let last=performance.now();
function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;
 try{if(state==='play'){time+=dt;games[cur].update(dt)}else time+=dt*.3;
  for(let i=fx.length-1;i>=0;i--){const p=fx[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.l<=0)fx.splice(i,1)}
  shake=Math.max(0,shake-dt*40);const k=cv.width/W;ctx.setTransform(k,0,0,k,0,0);ctx.save();if(shake>0)ctx.translate(R(-shake,shake)*.5,R(-shake,shake)*.5);
  games[cur].draw();fx.forEach(p=>{ctx.globalAlpha=Math.max(0,p.l/p.m);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,4,4)});ctx.globalAlpha=1;ng();ctx.restore();
  $('sc').textContent=score;$('bs').textContent=Math.max(best[games[cur].id]||0,state==='play'?score:0);const h=games[cur].hud();if($('lv').textContent!==h)$('lv').textContent=h}
 catch(err){console.error(err);state='over';show('Something broke','The game hit an error: '+err.message+'. Pick a game to restart.','Restart',false)}
 tap.clear();requestAnimationFrame(loop)}
size();pick(0);requestAnimationFrame(loop);
})();
