# Handoff: Atlas (Avenues Student Hub)

Everything a new session needs to keep building this site. Last updated 2026-11-14.

## What it is

A community site for high school students at Avenues The World School, run by Student Council. The president (Alexander) is the owner and approves everything.

- **Live site:** https://alexanderhuang.codeberg.page/Atlas/
- **Repo:** https://codeberg.org/alexanderhuang/Atlas (public). `main` holds the source; `pages` holds the built site that Codeberg Pages serves (through a git-pages webhook on the repo).
- **Backend:** Firebase project `atlas-bae05` (Google sign-in + Cloud Firestore, free plan). President's Firebase user ID: `4Dtjya2UUbdNGnynIZ8zCKRzfdT2`.
- **Second copy:** a claude.ai artifact, https://claude.ai/artifact/32d7F77SoUYbsDNwsQUiV3. Same source file. It can't enforce the student list, so the Codeberg site is the real one.

## Files

| File | Role |
|---|---|
| `stuco-hub.html` | The whole app, one file (HTML, CSS, JS). Edit this. |
| `tools/build_site.py` | Wraps the app with Firebase into `site/index.html`. Run after every change. |
| `site/firebase-adapter.js` | Gives the app the same `window.claude.use()` interface on top of Firebase (auth, Firestore, photos as data URLs in `photos/`, downloads). |
| `site/firebase-config.js` | Firebase web config + `OWNER_UID`. |
| `firestore.rules` | Security rules. The president pastes them into Firebase → Firestore → Rules → Publish after every change. Always tell him. |
| `tools/artifact-capabilities.json` | The `capabilities` value to pass when publishing the claude.ai artifact if rules change. |
| `tools/google-slides/` | Apps Script that rebuilds a Google Slides lost-and-found deck from Firestore hourly. Not yet installed by the president. |
| `student-list-template.csv` | Columns for the student list (Email, Name, Grade, Birthday, StuCo, Club leader). |

## Publishing a change (exact steps)

```bash
# 1. clone if the folder is gone (the old one was a temporary session folder)
git clone https://codeberg.org/alexanderhuang/Atlas.git && cd Atlas
git config user.name alexanderhuang && git config user.email alexanderhuang@noreply.codeberg.org
git remote rename origin codeberg

# 2. after editing stuco-hub.html
python3 tools/build_site.py
git add -A && git commit -m "…"      # end messages with the Co-Authored-By line
SPLIT=$(git subtree split --prefix site)
git push codeberg main "${SPLIT}:refs/heads/pages"   # normal push only; force-push is blocked by the safety check
```

- In zsh, write `"${SPLIT}:refs/…"` with braces: `"$SPLIT:r…"` breaks because `:r` is a zsh modifier.
- The live site updates within a minute or two. Check with `curl -s https://alexanderhuang.codeberg.page/Atlas/ | grep -c <new function name>`.
- The Codeberg token is in the Mac keychain (pushes work without a prompt). Never handle the president's passwords or tokens.
- Then republish the claude.ai artifact from `stuco-hub.html` (pass `tools/artifact-capabilities.json` only if rules changed).

## How the app is organized

- **Student tabs (4), no third level:** Today (`#home`: short pixel banner with a greeting, three live cards, one merged "Coming up" list of events, deadlines, sign-up closings, opportunity deadlines and private reminders, then announcements, the community feed with stories, Grade Race, birthdays, playlists, photo belt), Explore (Events with a Month view, Clubs, Opportunities), Play (one page: today's game, challenges, predictions, leaderboard; empty sections hide for students), StuCo (one page, side menu: Feedback, Polls, Lost and found, Our work). MySpace (`#myspace`) opens from the avatar in the top bar. `#bulletin` is the full announcements archive (under Today).
- **Old links:** `ALIAS` maps retired names (hub, community, create, collabs, life, connect, explore, challenges, dares, leaderboard) to their new place and section; keep it when renaming routes.
- **Council view** (switch in the menu): Overview, Tasks, Proposals, Attendance, Members, History, plus edit buttons everywhere. `council()` is false in student preview.
- **Routing:** `ROUTES` maps hash names to tabs; `VIEWFN` in `render()` maps them to view functions. `head(context,title,actions)` puts the title in the pixel banner.
- **Pixel scene:** animated Avenues building (time of day, season, plane with Aviator name, truck with latest news, birthday banner) in the Today banner and every page banner.
- **Daily games:** `games/<date>`; answers hashed, readable keys in `gamekeys/` (council only); a council member's browser settles points the next day (`settleGames`). Until then students see their own points as "+N pending" (`myPending()`, worked out from their own plays, photo entries and unconfirmed challenges; display only). Overview shows a "Points to settle" alert with a button if a finished game hasn't been settled. Practice mode for council (`trial`).
- **Access:** student list pasted from a Google Sheet into `roster/<email>`; StuCo column = council; "Only listed emails can join" toggle. Student posts wait in `submissions/` for council approval.
- **Data per person** lives in `<collection>/<uid>` documents with an `items` map (suggestions, signups, lostfound, bookings, gamevotes, replies…), written only by that person.

## Testing approach that works

Serve a copy locally (`python3 -m http.server`), add a doctype/viewport wrapper, open it in the browser pane, stub `db` with an in-memory object, set `me`/`isPres`/`CFG`/`S.*`, and render every route in both modes. Syntax-check the script with `osascript -l JavaScript` and `new Function(src)`.

## Open items

- President still to do: publish the latest `firestore.rules`; import the real student list; test that school Google accounts can sign in (unknown; if blocked, the list needs personal emails); set up bookable rooms; install the Google Slides script.
- Possible next steps: rebrand the visible name from "Avenues Student Hub" to **Atlas**; Google Search Console verification; automatic publishing on merge; move saved opportunities from the browser to the account.
- A GitHub repo `AlexanderHuangAvenuesPresident/Avenues-Student-Hub` exists but is empty and unused. Collaborator bingst0n should make a Codeberg account and send pull requests to the Codeberg repo.

## How the president works

- Judge every change against his 7-point rubric: visual design, branding, navigation, engagement, community, functionality, adoption.
- Design: Franklin Gothic (Libre Franklin), pixel-cut shapes, no generic AI looks, at most about three filters per row, few tabs.
- He wants things built, tested, published, then a plain summary of what changed and what he has to do.
