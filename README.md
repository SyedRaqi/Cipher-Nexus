<!-- CIPHER NEXUS | NEON ARCADE README -->

<div align="center">

<img src="cipher-nexus-banner.svg" width="100%" alt="Cipher Nexus animated neon arcade banner" />

<a href="https://github.com/SyedRaqi/Cipher-Nexus">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=20&duration=2800&pause=900&color=FF2BD6&center=true&vCenter=true&width=760&lines=Insert+coin.+Press+start.;A+simple+game+for+youngsters.;Search.+Filter.+Play.;Set+your+name.+Climb+the+board." alt="Typing animation" />
</a>

<br/>

<a href="#-insert-coin"><img src="https://img.shields.io/badge/INSERT%20COIN-FF2BD6?style=for-the-badge&logo=gamepad&logoColor=white" alt="Insert coin"/></a>
&nbsp;
<a href="#-the-arcade-floor"><img src="https://img.shields.io/badge/ARCADE%20FLOOR-00B8D4?style=for-the-badge&logo=rocket&logoColor=white" alt="Arcade floor"/></a>
&nbsp;
<a href="#-hall-of-fame"><img src="https://img.shields.io/badge/HALL%20OF%20FAME-F5C400?style=for-the-badge&logo=trophy&logoColor=black" alt="Hall of fame"/></a>

<br/><br/>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/SUPABASE-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase"/>
<img src="https://img.shields.io/badge/NO%20BUILD%20STEP-7C3AED?style=flat-square" alt="No build step"/>
<img src="https://img.shields.io/badge/LICENSE-UNLICENSE-lightgrey?style=flat-square" alt="Unlicense"/>

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:FF2BD6,50:FFE600,100:00F0FF&height=3" width="100%" alt="divider"/>

## 🕹️ Press Start

> **Cipher Nexus is a simple game for youngsters.**

It's a little arcade that lives in your browser: a game catalog you can search and filter by genre, individual game pages, lore, news, a community corner, and a leaderboard where your scores post automatically once you've picked a name. No installs, no build tools, just open it and play.

## 🏟️ The Arcade Floor

<div align="center">
<img src="cipher-nexus-floor.svg" width="96%" alt="The ten pages of the Cipher Nexus site as floating arcade screens" />
</div>

<br/>

<details>
<summary><b>🗺️ Floor map: what lives where</b></summary>

<br/>

| SCREEN | FILE | WHAT IT IS |
|---|---|---|
| 🏠 Home | `index.html` | The front door |
| 🎮 Games | `games.html` | The catalog, with live search and genre filters |
| 🕹️ Game | `game.html` | A single game's page |
| 📜 Lore | `lore.html` | The story behind the Nexus |
| 📰 News | `news.html` | Latest updates |
| 💬 Community | `community.html` | Where players hang out |
| 📖 Article | `article.html` | Longer reads |
| ℹ️ About | `about.html` | About the project |
| 🛟 Support | `support.html` | Help |
| 🚧 Lost level | `404.html` | Friendly dead end |

</details>

## ⚡ Power-Ups

<table>
<tr>
<td width="33%" valign="top">

### 🔎 Instant Search
Type in the games catalog and the list narrows as you go, no page reloads.

</td>
<td width="33%" valign="top">

### 🏷️ Genre Filters
Jump straight to the kind of game you're in the mood for.

</td>
<td width="33%" valign="top">

### 🏆 Auto-Posting Scores
Set a name (2+ characters) and your score posts itself after every run.

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🌐 Offline or Global
Works with zero setup, or plug in Supabase to share scores with everyone.

</td>
<td width="33%" valign="top">

### 🌌 Living Backdrop
An animated canvas scene sits behind the pages so the arcade never feels static.

</td>
<td width="33%" valign="top">

### 📱 Pocket Ready
The pages are set up with a mobile viewport and a themed browser bar color.

</td>
</tr>
</table>

## 🏆 Hall of Fame

<div align="center">
<img src="cipher-nexus-leaderboard.svg" width="94%" alt="Leaderboard with offline and global modes" />
</div>

The page includes a leaderboard. Scores post automatically after each run once the player has set a name (at least 2 characters).

**🔌 Offline mode (default):** with no configuration, scores are saved in this browser only.

**🌍 Global mode:** to share scores between players:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/schema.sql`.
3. In Project Settings > API, copy the **Project URL** and the **anon (public) key**.
4. Paste them into `CONFIG` in `js/leaderboard.js`.

> 🛡️ **Fair-play notes:** the anon key is designed to be public. Row level security allows reading and adding scores only, and the database rejects scores above what each game can produce and limits each name to one submission per 10 seconds. Because the games run in the browser, a determined cheater can still post a believable score.

## 🪙 Insert Coin

<div align="center">
<img src="cipher-nexus-start.svg" width="92%" alt="Insert coin, then press start" />
</div>

<br/>

**Step 1 · Grab the code**

```bash
git clone https://github.com/SyedRaqi/Cipher-Nexus.git
cd Cipher-Nexus
```

**Step 2 · Open the arcade**

It's plain HTML, CSS, and JavaScript, so there's nothing to install. Open `index.html` in your browser. For the most reliable results, serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

then visit http://localhost:8000.

## 🧱 Inside the Cabinet

```text
Cipher-Nexus/
├── index.html · games.html · game.html     # the main screens
├── lore.html · news.html · community.html  # world and people
├── article.html · about.html · support.html
├── 404.html                                # lost-level page
├── logo.svg                                # the Nexus mark
├── css/                                    # styles
├── js/
│   ├── data.js                             # game catalog data
│   ├── art.js · components.js              # visuals and shared page pieces
│   ├── main.js                             # page logic
│   ├── scene.js                            # animated canvas backdrop
│   └── leaderboard.js                      # leaderboard + CONFIG for Supabase
└── supabase/
    └── schema.sql                          # database setup for global scores
```

## 📜 License

Released under the [Unlicense](LICENSE). Take it, remix it, make it your own.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:FF2BD6,50:7C3AED,100:00F0FF&height=140&section=footer&text=GAME%20ON&fontColor=ffffff&fontSize=30&fontAlignY=70" width="100%" alt="Footer: game on"/>

**Cipher Nexus** · Built by [Syed Raqi](https://github.com/SyedRaqi) · [⭐ Star it if you had fun](https://github.com/SyedRaqi/Cipher-Nexus)

<sub>Insert coin. Press start. Beat your own high score.</sub>

</div>
