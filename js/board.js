/* Leaderboard panel: tabs, table, player name, and score submission after each run. */
(() => {
  const $ = id => document.getElementById(id);
  const GAMES = [['runner', 'Signal Runner'], ['arena', 'Last Light Arena'], ['ember', 'Ember Run'], ['duel', 'Iron Clash']];
  let game = 'runner', name = '', pending = null;
  try { name = localStorage.getItem('cn-name') || ''; } catch (_) {}
  const who = $('who'), sub = $('sub'), nm = $('nm'), sm = $('sm'), rows = $('lbrows'), msg = $('lbmsg'), tabs = $('lbtabs');

  const clean = v => v.replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 16);
  function setName(v) {
    name = clean(v); who.value = name;
    try { localStorage.setItem('cn-name', name); } catch (_) {}
  }
  who.value = name;
  $('mode').textContent = CNLB.online ? 'Live global scores' : 'Offline: scores stay on this device';
  $('mode').dataset.live = CNLB.online;

  function drawTabs() {
    tabs.innerHTML = GAMES.map(([id, n]) =>
      '<button class="chip" role="tab" data-g="' + id + '" aria-selected="' + (id === game) + '">' + n + '</button>').join('');
  }

  async function load() {
    msg.textContent = 'Loading scores…';
    try {
      const list = await CNLB.top(game, 10);
      rows.textContent = '';
      if (!list.length) {
        const tr = rows.insertRow(), td = tr.insertCell();
        td.colSpan = 4; td.textContent = 'No scores yet. Play a run and be the first.';
      }
      list.forEach((x, i) => {
        const tr = rows.insertRow();
        if (name && x.name === name) tr.className = 'me';
        [i + 1, x.name, x.score, new Date(x.created_at).toLocaleDateString()].forEach(v => { tr.insertCell().textContent = v; });
      });
      msg.textContent = '';
    } catch (e) {
      msg.textContent = 'Could not load scores: ' + e.message + '. Check your connection and press Refresh.';
    }
  }

  async function post() {
    if (!pending) return;
    const p = pending;
    sm.textContent = 'Posting your score…';
    const r = await CNLB.submit(p.id, name, p.score);
    if (r.ok) {
      pending = null;
      sm.textContent = r.mode === 'online'
        ? 'Score posted to the global leaderboard.'
        : 'Score saved on this device. Connect Supabase to share it globally.';
      game = p.id; drawTabs(); load();
    } else {
      sm.textContent = 'Could not post your score: ' + r.error;
    }
  }

  addEventListener('cn:over', e => {
    pending = e.detail.score > 0 ? e.detail : null;
    if (!pending) return;
    if (name.length >= 2) post();
    else { sub.hidden = false; sm.textContent = 'Add a name to post your score.'; nm.focus(); }
  });
  addEventListener('cn:reset', () => { sub.hidden = true; sm.textContent = ''; });
  sub.addEventListener('submit', e => {
    e.preventDefault(); setName(nm.value);
    if (name.length < 2) { sm.textContent = 'Use at least 2 characters.'; return; }
    sub.hidden = true; post();
  });
  who.addEventListener('change', () => { setName(who.value); load(); });
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-g]');
    if (b) { game = b.dataset.g; drawTabs(); load(); }
  });
  $('lbref').addEventListener('click', load);
  drawTabs(); load();
})();
