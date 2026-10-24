/* Eclipse garden: floating ruins, cloud seas, lanterns, and slow bird flights. */
(() => {
  const canvas = document.getElementById('bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const rand = (min, max) => min + Math.random() * (max - min);
  let width = 0, height = 0, time = 0, last = performance.now();
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, pulse = 0;
  let stars = [], lanterns = [], birds = [];
  const rings = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: width < 700 ? 95 : 155 }, () => ({
      x: rand(0, width), y: rand(0, height * .72), r: rand(.4, 1.5), phase: rand(0, TAU), alpha: rand(.18, .62)
    }));
    lanterns = Array.from({ length: width < 700 ? 7 : 12 }, (_, i) => ({
      x: rand(0, width), y: rand(0, height), speed: rand(5, 14), sway: rand(12, 38), phase: rand(0, TAU), size: rand(4, 8), delay: i
    }));
    birds = Array.from({ length: width < 700 ? 5 : 9 }, () => ({
      x: rand(-width, width), y: rand(height * .14, height * .58), speed: rand(12, 27), scale: rand(.45, .95), phase: rand(0, TAU), direction: Math.random() < .5 ? 1 : -1
    }));
    if (reduceMotion) draw(0);
  }

  function cloudBand(y, scale, opacity, phase) {
    const drift = Math.sin(time * .025 + phase) * width * .025 + pointerX * 9;
    ctx.save(); ctx.translate(drift, y + Math.sin(time * .035 + phase) * 5); ctx.scale(scale, 1);
    const fog = ctx.createLinearGradient(0, -40, 0, 45);
    fog.addColorStop(0, `rgba(205,174,153,${opacity})`);
    fog.addColorStop(.48, `rgba(168,137,139,${opacity * .62})`);
    fog.addColorStop(1, 'rgba(100,86,106,0)');
    ctx.fillStyle = fog; ctx.beginPath(); ctx.moveTo(-80, 15);
    for (let x = -80; x <= width + 100; x += 80) {
      const wav = Math.sin(x * .007 + phase + time * .03) * 13 + Math.sin(x * .016 + phase * 2) * 6;
      ctx.bezierCurveTo(x + 22, wav - 20, x + 52, wav - 21, x + 80, wav);
    }
    ctx.lineTo(width + 100, 70); ctx.lineTo(-80, 70); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function island(x, y, scale, phase, alpha = 1) {
    const drift = Math.sin(time * .12 + phase) * 9;
    const sway = Math.sin(time * .5 + phase) * 4;
    ctx.save(); ctx.translate(x + drift + pointerX * 11, y + pointerY * 4); ctx.scale(scale, scale); ctx.globalAlpha = alpha;

    // Floating earth shelf with warm sediment bands.
    ctx.fillStyle = '#282432'; ctx.strokeStyle = 'rgba(220,184,132,.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-138, 0); ctx.quadraticCurveTo(-96, -14, -62, -9);
    ctx.quadraticCurveTo(-8, -21, 34, -8); ctx.quadraticCurveTo(92, -19, 139, 1);
    ctx.lineTo(108, 38); ctx.lineTo(72, 56); ctx.lineTo(34, 64); ctx.lineTo(-18, 57); ctx.lineTo(-76, 44); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(183,125,99,.3)'; ctx.beginPath(); ctx.moveTo(-91, 20); ctx.quadraticCurveTo(0, 39, 92, 22); ctx.stroke();

    // Ancient garden wall and a broken archway.
    ctx.fillStyle = '#39333a'; ctx.fillRect(-44, -37, 88, 30);
    ctx.fillStyle = '#22222b'; ctx.beginPath(); ctx.moveTo(-21, -7); ctx.lineTo(-21, -27);
    ctx.quadraticCurveTo(-21, -55, 0, -55); ctx.quadraticCurveTo(21, -55, 21, -27); ctx.lineTo(21, -7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4a3b3c'; ctx.fillRect(-53, -40, 13, 35); ctx.fillRect(40, -32, 13, 27);
    ctx.fillStyle = 'rgba(218,174,112,.58)'; ctx.fillRect(-3, -22, 6, 9);

    // Small cypress trees move gently in the high wind.
    [-88, -60, 70, 99].forEach((tx, i) => {
      const treeSway = Math.sin(time * .7 + phase + i) * 4 + sway;
      ctx.strokeStyle = '#343a33'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx, -7); ctx.lineTo(tx + treeSway * .2, -37 - (i % 2) * 9); ctx.stroke();
      ctx.fillStyle = i % 2 ? '#505b48' : '#424f43';
      ctx.beginPath(); ctx.moveTo(tx - 12, -18); ctx.quadraticCurveTo(tx + treeSway, -59 - (i % 2) * 9, tx + 10, -18); ctx.closePath(); ctx.fill();
    });

    // Fine waterfalls dissolve into cloud below the island.
    ctx.globalAlpha = alpha * .33;
    for (let i = 0; i < 3; i++) {
      const wx = -35 + i * 31;
      ctx.strokeStyle = i === 1 ? '#d6b989' : '#b2a4a3'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(wx, 39); ctx.bezierCurveTo(wx + sway, 70, wx - sway, 91, wx + Math.sin(time + i) * 4, 121); ctx.stroke();
    }
    ctx.restore();
  }

  function eclipse(cx, cy, radius) {
    const halo = ctx.createRadialGradient(cx, cy, radius * .7, cx, cy, radius * 3.8);
    halo.addColorStop(0, 'rgba(214,166,117,.12)'); halo.addColorStop(.42, 'rgba(166,123,115,.08)'); halo.addColorStop(1, 'rgba(100,77,104,0)');
    ctx.fillStyle = halo; ctx.fillRect(cx - radius * 4, cy - radius * 4, radius * 8, radius * 8);
    const sun = ctx.createRadialGradient(cx - radius * .3, cy - radius * .4, radius * .1, cx, cy, radius);
    sun.addColorStop(0, '#e8cba0'); sun.addColorStop(.7, '#b58878'); sun.addColorStop(1, '#514450');
    ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.18 + Math.sin(time * .04) * .025);
    ctx.strokeStyle = 'rgba(214,187,144,.4)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, radius * 1.65, radius * .34, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(133,105,104,.42)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, 0, radius * 1.79, radius * .39, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  function lantern(lantern, dt) {
    lantern.y -= lantern.speed * dt;
    if (lantern.y < -30) { lantern.y = height + rand(20, height * .3); lantern.x = rand(0, width); }
    const x = lantern.x + Math.sin(time * .18 + lantern.phase) * lantern.sway;
    const y = lantern.y + Math.sin(time * .12 + lantern.phase) * 7;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, lantern.size * 5);
    glow.addColorStop(0, 'rgba(229,181,119,.2)'); glow.addColorStop(1, 'rgba(229,181,119,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, lantern.size * 5, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(time * .16 + lantern.phase) * .08);
    ctx.fillStyle = '#c59d73'; ctx.globalAlpha = .78;
    ctx.beginPath(); ctx.moveTo(0, -lantern.size); ctx.lineTo(lantern.size * .7, 0); ctx.lineTo(0, lantern.size * 1.25); ctx.lineTo(-lantern.size * .7, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(243,215,169,.5)'; ctx.lineWidth = .7; ctx.stroke(); ctx.restore(); ctx.globalAlpha = 1;
  }

  function drawBird(bird, dt) {
    bird.x += bird.speed * bird.direction * dt;
    if (bird.direction > 0 && bird.x > width + 30) bird.x = -30;
    if (bird.direction < 0 && bird.x < -30) bird.x = width + 30;
    const y = bird.y + Math.sin(time * .25 + bird.phase) * 5;
    const wing = Math.sin(time * 2.1 + bird.phase) * 4;
    ctx.save(); ctx.translate(bird.x + pointerX * 6, y); ctx.scale(bird.scale * bird.direction, bird.scale);
    ctx.globalAlpha = .48; ctx.strokeStyle = '#282632'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-9, 0); ctx.quadraticCurveTo(-4, -wing, 0, 0); ctx.quadraticCurveTo(5, -wing, 10, 0); ctx.stroke(); ctx.restore();
  }

  function draw(dt) {
    time += dt;
    pointerX += (targetX - pointerX) * .025; pointerY += (targetY - pointerY) * .025;
    const horizon = height * .69;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#171522'); sky.addColorStop(.34, '#40303d'); sky.addColorStop(.62, '#8a6059'); sky.addColorStop(1, '#26232d');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(width * .72, height * .31, 0, width * .72, height * .31, width * .58);
    glow.addColorStop(0, 'rgba(212,166,119,.15)'); glow.addColorStop(.55, 'rgba(168,112,111,.07)'); glow.addColorStop(1, 'rgba(98,74,105,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height * .85);
    stars.forEach(star => {
      ctx.globalAlpha = star.alpha * (.72 + Math.sin(time * .45 + star.phase) * .28);
      ctx.fillStyle = '#e6d6b7'; ctx.beginPath(); ctx.arc(star.x + pointerX * 2, star.y + pointerY * 2, star.r, 0, TAU); ctx.fill();
    }); ctx.globalAlpha = 1;

    eclipse(width * .73 - pointerX * 8, height * .29 - pointerY * 4, Math.min(width, height) * .105);
    cloudBand(height * .44, 1, .13, 1.2);
    island(width * .23, height * .42, Math.min(.76, width / 1300), 2.1, .82);
    island(width * .81, height * .54, Math.min(.56, width / 1700), 4.2, .7);
    cloudBand(horizon, 1.12, .2, 3.8);
    island(width * .51, height * .67, Math.min(1.03, width / 1050), .6, .96);
    cloudBand(height * .78, 1.3, .2, 5.1);

    // Dark cloud sea gives the floating garden a strong foreground silhouette.
    const sea = ctx.createLinearGradient(0, height * .76, 0, height);
    sea.addColorStop(0, 'rgba(41,34,44,.12)'); sea.addColorStop(.36, 'rgba(29,27,37,.78)'); sea.addColorStop(1, '#171820');
    ctx.fillStyle = sea; ctx.fillRect(0, height * .75, width, height * .25);
    for (let i = 0; i < 4; i++) {
      const y = height * (.8 + i * .055) + Math.sin(time * .045 + i) * 5;
      cloudBand(y, 1.35 + i * .1, .17 - i * .025, 8 + i);
    }

    birds.forEach(item => drawBird(item, dt));
    lanterns.forEach(item => lantern(item, dt));

    pulse = Math.max(0, pulse - dt * .55);
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i]; ring.radius += dt * 70; ring.alpha -= dt * .28;
      if (ring.alpha <= 0) { rings.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(219,177,124,${ring.alpha * pulse})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(width * .5, height * .65, ring.radius, ring.radius * .34, 0, 0, TAU); ctx.stroke();
    }
  }

  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000 || 0);
    last = now; draw(dt); requestAnimationFrame(frame);
  }

  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduceMotion) return;
    targetX = event.clientX / innerWidth * 2 - 1;
    targetY = event.clientY / innerHeight * 2 - 1;
  }, { passive: true });
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  window.CNBG = {
    pulse(amount = 1) {
      pulse = Math.min(1, pulse + amount * .18);
      if (amount > .3) rings.push({ radius: 12, alpha: .34 });
    }
  };

  resize();
  if (!reduceMotion) requestAnimationFrame(frame);
})();
