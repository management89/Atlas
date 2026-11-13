/**
 * Atlas lost and found → Google Slides
 *
 * This script lives inside a Google Slides deck (Extensions → Apps Script). It reads the open lost and found
 * items from the Atlas Firebase database and rebuilds the deck: a title slide, then one slide per item with its
 * photo, what it is, where and when, and the description. Share the deck's link once; it stays up to date.
 *
 * Run it with the Google account that created the Firebase project (atlas-bae05). That account can already read
 * the database, so the site's security rules don't need to change.
 */
const PROJECT_ID = 'atlas-bae05';
const BASE = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/';
const NAVY = '#14202E', GOLD = '#F4B400', GRAY = '#56606C', FONT = 'Libre Franklin';

/** Adds a "Lost and found" menu to the deck. */
function onOpen() {
  SlidesApp.getUi().createMenu('Lost and found')
    .addItem('Refresh now', 'refreshDeck')
    .addItem('Refresh automatically every hour', 'installHourly')
    .addToUi();
}

/** Rebuilds the whole deck from the current lost and found items. */
function refreshDeck() {
  const deck = deck_(), W = deck.getPageWidth(), H = deck.getPageHeight(), tz = Session.getScriptTimeZone();
  const list = items_(), month = Utilities.formatDate(new Date(), tz, 'MMMM').toUpperCase();
  const old = deck.getSlides();

  const first = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  text_(first, month + ' LOST AND FOUND', 30, H * 0.34, W - 60, 70, 44, true, NAVY, SlidesApp.ParagraphAlignment.CENTER);
  text_(first, list.length + (list.length === 1 ? ' item' : ' items') + '. If something here is yours, tell Student Council.',
    30, H * 0.34 + 80, W - 60, 40, 18, false, GRAY, SlidesApp.ParagraphAlignment.CENTER);
  text_(first, 'Updated ' + Utilities.formatDate(new Date(), tz, 'MMM d, h:mm a'), 30, H - 56, W - 60, 24, 11, false, GRAY, SlidesApp.ParagraphAlignment.CENTER);
  bar_(first, W, H);

  for (const x of list) {
    const s = deck.appendSlide(SlidesApp.PredefinedLayout.BLANK), found = x.type === 'found';
    text_(s, month + ' LOST AND FOUND', 20, 12, W - 40, 40, 24, true, NAVY, SlidesApp.ParagraphAlignment.CENTER);

    // photo on the left, scaled to fit its box
    const bx = 24, by = 62, bw = W * 0.5, bh = H - by - 34;
    let img = null;
    try { const blob = photo_(x.photo); if (blob) img = s.insertImage(blob); } catch (e) { img = null; }
    if (img) {
      const k = Math.min(bw / img.getWidth(), bh / img.getHeight());
      img.setWidth(img.getWidth() * k).setHeight(img.getHeight() * k);
      img.setLeft(bx + (bw - img.getWidth()) / 2).setTop(by + (bh - img.getHeight()) / 2);
    } else {
      const r = s.insertShape(SlidesApp.ShapeType.RECTANGLE, bx, by, bw, bh);
      r.getFill().setSolidFill('#E8ECF1'); r.getBorder().setTransparent();
      text_(s, 'No photo', bx, by + bh / 2 - 15, bw, 30, 14, false, GRAY, SlidesApp.ParagraphAlignment.CENTER);
    }

    // the details on the right
    const tx = bx + bw + 24, tw = W - tx - 24;
    text_(s, found ? 'FOUND' : 'LOST', tx, by + 4, tw, 24, 13, true, found ? '#1D7A45' : '#B3261E');
    text_(s, x.what, tx, by + 30, tw, 64, 24, true, NAVY);
    let y = by + 100;
    if (x.where || x.date) {
      const when = x.date ? Utilities.formatDate(new Date(x.date + 'T12:00:00'), tz, 'MMM d') : '';
      text_(s, (found ? 'Found' : 'Last seen') + (x.where ? ': ' + x.where : '') + (when ? ', ' + when : ''), tx, y, tw, 30, 14, false, GRAY);
      y += 36;
    }
    if (x.details) text_(s, x.details, tx, y, tw, 100, 14, false, NAVY);
    if (x.name) text_(s, 'Posted by ' + x.name, tx, H - 100, tw, 24, 12, false, GRAY);
    text_(s, found ? 'Is this yours? Tell Student Council.' : 'Seen it? Tell Student Council.', tx, H - 72, tw, 26, 13, true, NAVY);
    bar_(s, W, H);
  }
  old.forEach(function (sl) { sl.remove(); });
}

/** Sets the deck to refresh itself every hour (replaces any earlier schedule). */
function installHourly() {
  PropertiesService.getScriptProperties().setProperty('DECK_ID', SlidesApp.getActivePresentation().getId());
  ScriptApp.getProjectTriggers().filter(function (t) { return t.getHandlerFunction() === 'refreshDeck'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('refreshDeck').timeBased().everyHours(1).create();
  refreshDeck();
  SlidesApp.getUi().alert('Done. The deck now refreshes itself every hour.');
}

/* ---------- helpers ---------- */
function deck_() {
  try { const d = SlidesApp.getActivePresentation(); if (d) return d; } catch (e) {}
  return SlidesApp.openById(PropertiesService.getScriptProperties().getProperty('DECK_ID'));
}
function fs_(path) {
  const res = UrlFetchApp.fetch(BASE + path, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
  if (res.getResponseCode() === 404) return null;
  if (res.getResponseCode() !== 200) throw new Error('Firebase answered ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
  return JSON.parse(res.getContentText());
}
// Firestore sends typed values ({stringValue: …}); turn them into plain values
function val_(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('mapValue' in v) { const o = {}, f = v.mapValue.fields || {}; for (const k in f) o[k] = val_(f[k]); return o; }
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val_);
  return null;
}
function items_() {
  const out = [];
  let token = '';
  do {
    const page = fs_('lostfound?pageSize=300' + (token ? '&pageToken=' + encodeURIComponent(token) : ''));
    ((page && page.documents) || []).forEach(function (d) {
      const items = (val_({ mapValue: { fields: d.fields || {} } }) || {}).items || {};
      for (const k in items) { const x = items[k]; if (x && x.what && x.status !== 'returned') out.push(x); }
    });
    token = page && page.nextPageToken;
  } while (token);
  return out.sort(function (a, b) { return String(b.at || '').localeCompare(String(a.at || '')); });
}
function photo_(id) {
  if (!id) return null;
  let data = String(id);
  if (data.indexOf('data:') !== 0) {
    const d = fs_('photos/' + encodeURIComponent(id));
    data = d && d.fields && d.fields.data ? d.fields.data.stringValue : '';
  }
  const m = data.match(/^data:(image\/[a-z+]+);base64,(.*)$/);
  return m ? Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], 'photo') : null;
}
function text_(slide, str, x, y, w, h, size, bold, color, align) {
  const box = slide.insertTextBox(String(str), x, y, w, h);
  box.getText().getTextStyle().setFontFamily(FONT).setFontSize(size).setBold(!!bold).setForegroundColor(color || NAVY);
  if (align) box.getText().getParagraphStyle().setParagraphAlignment(align);
  return box;
}
function bar_(slide, W, H) {
  const r = slide.insertShape(SlidesApp.ShapeType.RECTANGLE, 0, H - 14, W, 14);
  r.getFill().setSolidFill(GOLD); r.getBorder().setTransparent();
}
