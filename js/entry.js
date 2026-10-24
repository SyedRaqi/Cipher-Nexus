/* Three-dimensional arrival, then an explicit entrance into the arcade. */
(() => {
  const gate = document.getElementById('opening');
  const enter = document.getElementById('enter-arcade');
  const app = document.querySelector('.wrap');
  if (!gate || !enter || !app) return;

  const status = document.getElementById('opening-status');
  const hint = gate.querySelector('.opening-hint');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ready = false;

  app.inert = true;
  enter.disabled = !reducedMotion;

  function unlock() {
    if (ready) return;
    ready = true;
    enter.disabled = false;
    gate.classList.add('is-ready');
    status.textContent = 'Signal locked · transmission received';
    hint.textContent = 'Enter the arcade to choose your game.';
  }

  if (reducedMotion) unlock();
  else window.setTimeout(unlock, 2850);

  enter.addEventListener('click', () => {
    if (!ready) return;
    gate.classList.add('is-exiting');
    gate.setAttribute('aria-hidden', 'true');
    app.inert = false;
    document.body.classList.remove('opening-active');
    window.setTimeout(() => {
      gate.hidden = true;
      document.querySelector('#rail .cab')?.focus({ preventScroll: true });
    }, 760);
  });
})();
