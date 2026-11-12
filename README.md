# Avenues Student Hub

The Student Council workspace for Avenues The World School. One page covers the council's calendar, tasks, the school bulletin, a suggestion box, proposals, attendance and member profiles.

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
- **Attendance** with an automatic quorum check, **member profiles** approved by email, and a **history** log of every change.

## How it runs today

`stuco-hub.html` is published as a Claude artifact. On claude.ai it gets sign-in, a shared database and file downloads from the artifact platform. Opened anywhere else, such as GitHub Pages, it loads the layout but shows a notice and saves nothing.

Access is set by the page's share level on claude.ai:

| Who | Share level | What they can do |
|---|---|---|
| President | Owner | Everything, including assigning tasks and approving members |
| Council members | Editor | Edit the calendar, bulletin, proposals and attendance; accept tasks |
| Students | Contributor | Sign up for events, vote in polls, send suggestions, share playlists and birthdays |
| Anyone else | Viewer | Read the student side only |

The database rules enforce this on the server. Proposals, attendance, history, poll votes and suggestions can't be read below Editor (students only see their own), and only the president can create tasks or change approvals.

## Next step

The plan is to run the hub as a normal website, hosted on GitHub Pages with Firebase for Google sign-in and the database, so anyone at Avenues can use it with their school account. The page already saves data in a Firestore-like way, so most of the work is swapping the artifact calls for the Firebase SDK and writing matching Firestore security rules.

## Files

- `stuco-hub.html`: the whole app (HTML, CSS and JavaScript in one file). It loads Libre Franklin from Google Fonts, plus jsPDF and JSZip from cdnjs for exports.
