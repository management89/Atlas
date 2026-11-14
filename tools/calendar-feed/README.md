# Calendar feed

Lets students subscribe once and get every school event (not StuCo meetings or grade-only events) in Google Calendar or Apple Calendar. It refreshes on its own; Google Calendar re-checks subscribed calendars every few hours.

## Set it up (about 5 minutes, once)

1. Go to https://script.google.com and click **New project**. Use the Student Council Google account.
2. Delete what's there, paste everything from `Code.gs`, and click **Save**. Name it "Student Hub calendar feed".
3. Click **Deploy → New deployment**. Click the gear next to "Select type" and pick **Web app**.
4. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and allow access when asked.
5. Copy the **Web app URL** (it ends in `/exec`).
6. On the site, signed in as president: **Explore → Events → Connect calendar feed**, paste the link, save.

Students then see **Subscribe in Google Calendar** and **Apple Calendar** on the Events page, and **Add to my calendar** on Today.

Events are already public on the site (anyone can read them), so the script needs no keys or passwords.
