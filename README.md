# Avenues Student Hub

The student hub and Student Council workspace for Avenues The World School.

**Website:** https://alexanderhuang.codeberg.page/Atlas/

## What's in it

**For students (five tabs)**
- **Student Hub:** this week at a glance (schedule and location changes, what's coming up, deadlines and reminders, announcements), a full calendar, and the weekly bulletin.
- **Events:** dances, trips, tournaments and competitions with details, schedules, prices and spots left. Students RSVP, sign up, register a team or reserve a ticket in one click.
- **Student Life:** event photos drifting across the page in two rows. Click any photo to open its full album. Also recaps, spotlights, achievements, club highlights, interviews, memes, opt-in birthdays and student playlists.
- **Opportunities:** a searchable board of volunteering, internships, competitions, trips, club recruitment, and music, art and athletics opportunities, with deadlines and a Save list.
- **Student Voice:** school-wide polls (council posts the results), suggestions, vending machine requests, problem reports, and a view of what each council member is working on.

**For council members**
- A Student view / Council view switch, so the president can see exactly what students see.
- **Tasks:** the president assigns tasks or leaves them open. Members accept their tasks and mark them started or done.
- **Proposals:** written in a built-in template that formats itself as you type. They export as a PDF and as a .docx that opens in Google Docs, and move from Draft to a roll-call vote.
- **Attendance** with an automatic quorum check, **member profiles** approved by the president, and a **history** log of every change.

## Who can do what

| Who | How | What they can do |
|---|---|---|
| Anyone | Just open the site | Read the bulletin, calendar, events and opportunities |
| Students | Sign in with Google | Everything on the student side; sign up for events, vote, suggest, share playlists and birthdays |
| Council members | Sign in, create a profile, get approved by the president | Edit the school site; council pages |
| President | The user ID set in `firebase-config.js` and `firestore.rules` | Everything, including assigning tasks and approving members |

The rules in `firestore.rules` enforce this on Firebase's servers, not just in the page.

## Files

| File | What it is |
|---|---|
| `stuco-hub.html` | The whole app. The single source for both the claude.ai artifact and the website. |
| `site/` | The website, served by Codeberg Pages from the `pages` branch. |
| `site/index.html` | Built from `stuco-hub.html` by `tools/build_site.py`. Don't edit it by hand. |
| `site/firebase-config.js` | Your Firebase project settings and the president's user ID. |
| `site/firebase-adapter.js` | Connects the app to Firebase (Google sign-in, database, photos, downloads). |
| `firestore.rules` | Database security rules. Paste into the Firebase console. |
| `tools/build_site.py` | Rebuilds `site/` after the app changes. |

## Setting up Firebase (one time, free)

1. Go to https://console.firebase.google.com and click **Create a project**. Use a Google account made for Student Council, not a personal one. Google Analytics isn't needed.
2. **Authentication → Get started → Google → Enable**, then save.
3. **Authentication → Settings → Authorized domains → Add domain:** `alexanderhuang.codeberg.page`
4. **Firestore Database → Create database.** Pick a location near you and start in **production mode**.
5. **Project settings (gear icon) → General → Your apps → Web (`</>`)**. Register an app called "Student Hub" (no Firebase Hosting), then copy the `firebaseConfig` values into `site/firebase-config.js`.
6. Open the site and sign in with Google. A box at the bottom shows your user ID. Paste it into `site/firebase-config.js` (`OWNER_UID`) and into `firestore.rules` (replace `PASTE_PRESIDENT_UID`).
7. **Firestore Database → Rules:** replace everything with the contents of `firestore.rules` and click **Publish**.
8. Push the updated `site/firebase-config.js` and refresh the site. You're the president.

Optional: to let only school accounts sign up, vote and suggest, edit `allowedEmail()` in `firestore.rules`.

### Photos

Firebase's file storage now needs a paid plan, so photos are shrunk and stored in Firestore instead, around 100 to 500 KB each. The free plan holds about 1 GB, a few thousand photos. If the site outgrows that, move photos to Firebase Storage on the Blaze plan.

## Updating the website

```bash
python3 tools/build_site.py
git add -A && git commit -m "Update site"
git push codeberg main
git subtree split --prefix site -b pages && git push -f codeberg pages
```

## Getting listed on Google

1. Go to https://search.google.com/search-console and add the property `https://alexanderhuang.codeberg.page/Atlas/` using the **URL prefix** option.
2. To verify, pick **HTML tag**, copy the `<meta name="google-site-verification" ...>` tag, and add it to the head in `tools/build_site.py`. Rebuild, push, then click **Verify**.
3. Under **Sitemaps**, submit `sitemap.xml`. Then use **URL inspection → Request indexing**.

Google usually lists a new site within a few days to two weeks.
