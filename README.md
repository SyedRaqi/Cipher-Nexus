## Leaderboard

The page includes a leaderboard section. Scores post automatically after each run once the player has set a name (at least 2 characters).

**Offline mode (default):** with no configuration, scores are saved in this browser only.

**Global mode:** to share scores between players:

1. Create a free project at supabase.com.
2. In the SQL Editor, run `supabase/schema.sql`.
3. In Project Settings > API, copy the Project URL and the anon (public) key.
4. Paste them into `CONFIG` in `js/leaderboard.js`.

The anon key is designed to be public. Row level security allows reading and adding scores only, and the database rejects scores above what each game can produce and limits each name to one submission per 10 seconds. Because the games run in the browser, a determined cheater can still post a believable score.