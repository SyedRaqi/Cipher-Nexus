/* Leaderboard client.
   Paste your Supabase project URL and anon (public) key below to go global.
   Leave them empty and scores are kept on this device only. */
window.CNLB = (() => {
  const CONFIG = {
    url: '',      // e.g. 'https://abcdxyz.supabase.co'
    anonKey: ''   // the "anon" / "publishable" key (safe to expose; RLS protects the table)
  };
  const online = !!(CONFIG.url && CONFIG.anonKey);
  const LS = 'cn-lb';
  const headers = () => ({
    apikey: CONFIG.anonKey,
    Authorization: 'Bearer ' + CONFIG.anonKey,
    'Content-Type': 'application/json'
  });
  const readLocal = () => { try { return JSON.parse(localStorage.getItem(LS)) || []; } catch (_) { return []; } };
  const writeLocal = rows => { try { localStorage.setItem(LS, JSON.stringify(rows.slice(-200))); return true; } catch (_) { return false; } };

  async function fail(r) {
    let m = r.status + ' ' + r.statusText;
    try { const j = await r.json(); m = j.message || j.hint || m; } catch (_) {}
    throw new Error(m);
  }

  async function submit(game, name, score) {
    if (!online) {
      const ok = writeLocal(readLocal().concat({ game, name, score, created_at: new Date().toISOString() }));
      return ok ? { ok: true, mode: 'local' } : { ok: false, error: 'Browser storage is unavailable.' };
    }
    try {
      const r = await fetch(CONFIG.url + '/rest/v1/scores', {
        method: 'POST',
        headers: { ...headers(), Prefer: 'return=minimal' },
        body: JSON.stringify({ game, name, score })
      });
      if (!r.ok) await fail(r);
      return { ok: true, mode: 'online' };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function top(game, limit = 10) {
    if (!online) {
      return readLocal().filter(x => x.game === game)
        .sort((a, b) => b.score - a.score || a.created_at.localeCompare(b.created_at)).slice(0, limit);
    }
    const q = '?game=eq.' + encodeURIComponent(game) + '&select=name,score,created_at&order=score.desc,created_at.asc&limit=' + limit;
    const r = await fetch(CONFIG.url + '/rest/v1/scores' + q, { headers: headers() });
    if (!r.ok) await fail(r);
    return r.json();
  }

  return { online, submit, top };
})();
