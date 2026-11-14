/**
 * Avenues Student Hub: calendar subscription feed.
 * Serves every school event (not StuCo meetings) as an .ics calendar that students subscribe to once.
 * Events are publicly readable in Firestore, so no keys or passwords are needed.
 * Deploy: Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone. Paste the /exec link
 * into the site: Explore > Events > Connect calendar feed (president only).
 */
var PROJECT_ID = "atlas-bae05";
var CAL_NAME = "Avenues Student Hub";

function doGet() {
  var body = buildIcs_(fetchEvents_());
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.ICAL);
}

function fetchEvents_() {
  var out = [], token = "";
  do {
    var url = "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID + "/databases/(default)/documents/events?pageSize=300" + (token ? "&pageToken=" + encodeURIComponent(token) : "");
    var res = JSON.parse(UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText() || "{}");
    (res.documents || []).forEach(function (d) {
      var f = d.fields || {}, e = { id: d.name.split("/").pop() };
      Object.keys(f).forEach(function (k) { var v = f[k]; e[k] = v.stringValue != null ? v.stringValue : v.integerValue != null ? String(v.integerValue) : v.booleanValue; });
      out.push(e);
    });
    token = res.nextPageToken || "";
  } while (token);
  var cutoff = Utilities.formatDate(new Date(Date.now() - 60 * 864e5), "UTC", "yyyy-MM-dd");
  return out.filter(function (e) { return e.date && e.type !== "meeting" && !e.grade && e.date >= cutoff; });
}

function esc_(t) { return String(t || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1"); }
function pad_(n) { return (n < 10 ? "0" : "") + n; }
function ymd_(d) { return d.getFullYear() + pad_(d.getMonth() + 1) + pad_(d.getDate()); }

function buildIcs_(events) {
  var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Avenues Student Hub//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "X-WR-CALNAME:" + CAL_NAME, "REFRESH-INTERVAL;VALUE=DURATION:PT6H", "X-PUBLISHED-TTL:PT6H"];
  var stamp = Utilities.formatDate(new Date(), "UTC", "yyyyMMdd'T'HHmmss'Z'");
  events.forEach(function (e) {
    var p = e.date.split("-"), day = new Date(+p[0], +p[1] - 1, +p[2]);
    L.push("BEGIN:VEVENT", "UID:" + e.id + "@avenues-student-hub", "DTSTAMP:" + stamp, "SUMMARY:" + esc_(e.title));
    if (e.time) {
      var t = e.time.split(":"), end = new Date(day); end.setHours(+t[0] + 1, +t[1]);
      L.push("DTSTART:" + ymd_(day) + "T" + pad_(+t[0]) + pad_(+t[1]) + "00", "DTEND:" + ymd_(end) + "T" + pad_(end.getHours()) + pad_(end.getMinutes()) + "00");
    } else {
      var next = new Date(day); next.setDate(next.getDate() + 1);
      L.push("DTSTART;VALUE=DATE:" + ymd_(day), "DTEND;VALUE=DATE:" + ymd_(next));
    }
    if (e.location) L.push("LOCATION:" + esc_(e.location));
    var desc = [e.details || e.notes || "", e.change ? "Changed: " + e.change : ""].filter(String).join("\n");
    if (desc) L.push("DESCRIPTION:" + esc_(desc));
    L.push("END:VEVENT");
  });
  L.push("END:VCALENDAR");
  return L.join("\r\n") + "\r\n";
}
