/* Self-contained animated Cipher Nexus trailer for the home page modal. */
(function(){
 const dialog=document.querySelector('.trailer'),visual=dialog?.querySelector('.teaser-visual');
 if(!dialog||!visual)return;
 visual.innerHTML='<canvas class="trailer-canvas" aria-label="Animated Cipher Nexus trailer" role="img"></canvas><div class="trailer-caption" aria-live="polite"></div>';
 const replay=document.createElement('button');replay.type='button';replay.className='btn sm trailer-replay';replay.textContent='Replay trailer';visual.after(replay);
 const canvas=visual.querySelector('canvas'),ctx=canvas.getContext('2d'),caption=visual.querySelector('.trailer-caption');
 const W=960,H=540,stars=Array.from({length:190},(_,i)=>({x:(i*7919%997)/997*W,y:(i*3571%991)/991*H,z:.35+(i*13%10)/10,r:.5+(i*7%16)/10}));
 let raf=0,started=0,playing=false,lastCaption=-1;
 function size(){const dpr=Math.min(devicePixelRatio||1,2),r=visual.getBoundingClientRect();canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0)}
 function glowCircle(x,y,r,color,blur){ctx.save();ctx.shadowColor=color;ctx.shadowBlur=blur;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore()}
 function text(t,a){ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='700 20px Arial';ctx.letterSpacing='5px';ctx.fillStyle='#fff';ctx.shadowColor='#00f0ff';ctx.shadowBlur=18;ctx.fillText(t,W/2,H-82);ctx.restore()}
 function render(now){if(!playing)return;const t=(now-started)/1000;ctx.clearRect(0,0,W,H);
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#050113');sky.addColorStop(.58,'#13052d');sky.addColorStop(1,'#260746');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  const speed=1+t*1.7;stars.forEach((s,i)=>{let x=(s.x-t*speed*s.z*17)%W;if(x<0)x+=W;let y=s.y+Math.sin(t*.5+i)*4;ctx.globalAlpha=.4+s.z*.55;ctx.fillStyle=i%9===0?'#ff8cbf':i%5===0?'#00f0ff':'#fff';ctx.fillRect(x,y,s.r*s.z,s.r*s.z)});ctx.globalAlpha=1;
  // A distant world emerges from the signal haze.
  const planetX=785-t*5,planetY=260,planetR=152+Math.sin(t*.4)*3;const pg=ctx.createRadialGradient(planetX-54,planetY-65,8,planetX,planetY,planetR);pg.addColorStop(0,'#ff9de0');pg.addColorStop(.3,'#9d4dff');pg.addColorStop(1,'#16072f');ctx.fillStyle=pg;ctx.beginPath();ctx.arc(planetX,planetY,planetR,0,Math.PI*2);ctx.fill();ctx.save();ctx.translate(planetX,planetY);ctx.rotate(-.18);ctx.strokeStyle='#00f0ff';ctx.globalAlpha=.55;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,planetR*1.5,planetR*.34,0,Math.PI,Math.PI*2);ctx.stroke();ctx.restore();
  // Fracture in reality opens, then contracts into a bright gateway.
  const phase=Math.max(0,Math.min(1,(t-3)/5)),riftX=460+Math.sin(t*.5)*12,riftY=246,riftH=35+phase*180,riftW=12+phase*52;
  if(t>2){ctx.save();ctx.translate(riftX,riftY);ctx.rotate(Math.sin(t*.7)*.08);ctx.shadowColor='#00f0ff';ctx.shadowBlur=30+phase*26;ctx.strokeStyle='#00f0ff';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,riftW,riftH,0,0,Math.PI*2);ctx.stroke();ctx.shadowColor='#ff2e97';ctx.strokeStyle='#ff2e97';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,riftW*.68,riftH*.83,0,0,Math.PI*2);ctx.stroke();const core=ctx.createRadialGradient(0,0,0,0,0,riftH);core.addColorStop(0,'#fff');core.addColorStop(.08,'#00f0ff');core.addColorStop(.38,'#9d4dff88');core.addColorStop(1,'#9d4dff00');ctx.fillStyle=core;ctx.beginPath();ctx.ellipse(0,0,riftW,riftH,0,0,Math.PI*2);ctx.fill();ctx.restore()}
  // Runner ship sweeps toward the gateway.
  const shipX=-100+Math.min(1,t/12)*710,shipY=340-Math.sin(t*.65)*22;ctx.save();ctx.translate(shipX,shipY);ctx.rotate(-.04);ctx.shadowColor='#00f0ff';ctx.shadowBlur=22;ctx.fillStyle='#dffcff';ctx.beginPath();ctx.moveTo(46,0);ctx.lineTo(-31,-22);ctx.lineTo(-17,0);ctx.lineTo(-31,22);ctx.closePath();ctx.fill();ctx.fillStyle='#ff2e97';ctx.beginPath();ctx.moveTo(-26,-12);ctx.lineTo(-65,0);ctx.lineTo(-26,12);ctx.closePath();ctx.fill();glowCircle(-42,0,4,'#ffe45c',18);ctx.restore();
  // Combat shards cross the path as the worlds collide.
  if(t>10&&t<20){for(let i=0;i<8;i++){const x=(i*157+W-(t*110+i*41)%W),y=80+(i*79%330)+Math.sin(t*2+i)*32;ctx.save();ctx.translate(x,y);ctx.rotate(t+i);ctx.strokeStyle=i%2?'#ff2e97':'#ffe45c';ctx.lineWidth=3;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(9,0);ctx.lineTo(0,12);ctx.lineTo(-9,0);ctx.closePath();ctx.stroke();ctx.restore()}}
  // A beam stitches the rift closed for the title reveal.
  if(t>17){const a=Math.min(1,(t-17)/3);ctx.save();ctx.globalAlpha=a*.8;ctx.strokeStyle='#00f0ff';ctx.lineWidth=3+Math.sin(t*8)*2;ctx.shadowColor='#00f0ff';ctx.shadowBlur=30;ctx.beginPath();ctx.moveTo(shipX+35,shipY);ctx.lineTo(riftX,riftY);ctx.stroke();ctx.restore()}
  const scenes=[['WHEN REALITY BREAKS',0,3.4],['A SIGNAL CROSSES THE VOID',3.4,7.4],['RUNNERS ANSWER THE CALL',7.4,12.4],['FIGHT FOR WHAT REMAINS',12.4,17.5],['STITCH THE WORLDS TOGETHER',17.5,21.5],['CIPHER NEXUS  ·  ENTER THE UNKNOWN',21.5,26]];const idx=scenes.findIndex(s=>t>=s[1]&&t<s[2]);if(idx!==lastCaption&&idx>=0){caption.textContent=scenes[idx][0];lastCaption=idx}if(t>21.5){const a=Math.min(1,(t-21.5)*1.5);ctx.save();ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='400 64px Audiowide,Arial';ctx.fillStyle='#fff';ctx.shadowColor='#ff2e97';ctx.shadowBlur=32;ctx.fillText('CIPHER NEXUS',W/2,H/2+20);ctx.font='700 16px Arial';ctx.letterSpacing='8px';ctx.fillStyle='#00f0ff';ctx.fillText('GAMES BEYOND REALITY',W/2,H/2+65);ctx.restore()}
  if(t>=26){playing=false;replay.hidden=false;return}raf=requestAnimationFrame(render)
 }
 function play(){cancelAnimationFrame(raf);size();started=performance.now();playing=true;lastCaption=-1;caption.textContent='';replay.hidden=true;raf=requestAnimationFrame(render)}
 document.querySelectorAll('[data-trailer]').forEach(b=>b.addEventListener('click',play));replay.addEventListener('click',play);dialog.addEventListener('close',()=>{playing=false;cancelAnimationFrame(raf)});addEventListener('resize',size);size();
})();
