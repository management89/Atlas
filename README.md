# Avenues Student Hub

The Student Council workspace for Avenues The World School. One page covers the council's calendar, tasks, the school bulletin, a suggestion box, proposals, attendance and member profiles.

## What's in it

**For everyone at Avenues**
- **Bulletin:** announcements, spirit week themes, events and opportunities, with pinned posts at the top.
- **Calendar:** council meetings, school events, deadlines and fundraisers.
- **Who's working on what:** every council member's current tasks and their status (working on it, up next, done).
- **Suggestion box:** send an idea to council and see its status and council's reply.

**For council members**
- **Tasks:** the president assigns tasks or leaves them open. Members accept their tasks and mark them started or done.
- **Proposals:** written in a built-in template (summary, background, proposed action, budget, timeline, impact, resolution) that formats itself as you type. Proposals export as a PDF to send and as a .docx that opens in Google Docs. They move through Draft, Moved, Seconded and Vote open, then Passed or Failed, with roll-call votes.
- **Attendance:** roll call at each meeting with an automatic quorum check (more than half of members present).
- **Members:** profiles with a photo and short description. The president approves members by email address.
- **History:** a log of every change, with who made it and when.

## How it runs today

`stuco-hub.html` is published as a Claude artifact. On claude.ai it gets sign-in, a shared database and file downloads from the artifact platform. Opened anywhere else, such as GitHub Pages, it loads the layout but shows a notice and saves nothing.

Access is set by the page's share level on claude.ai:

| Who | Share level | What they can do |
|---|---|---|
| President | Owner | Everything, including assigning tasks and approving members |
| Council members | Editor | Edit the calendar, bulletin, proposals and attendance; accept tasks |
| Anyone given Contributor access | Contributor | Send suggestions; ask to join council |
| The rest of the school | Viewer | Read the bulletin, calendar and tasks |

The database rules enforce this on the server. Proposals, attendance and history can't be read below Editor, and only the president can create tasks or change approvals.

## Next step

The plan is to run the hub as a normal website, hosted on GitHub Pages with Firebase for Google sign-in and the database, so anyone at Avenues can use it with their school account. The page already saves data in a Firestore-like way, so most of the work is swapping the artifact calls for the Firebase SDK and writing matching Firestore security rules.

## Files

- `stuco-hub.html`: the whole app (HTML, CSS and JavaScript in one file). It loads Libre Franklin from Google Fonts, plus jsPDF and JSZip from cdnjs for exports.
