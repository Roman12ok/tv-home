// Home screen for a 2018 Samsung TV (Tizen 4.0 = Chrome 56): no object spread,
// optional chaining, padStart or `catch {}`.
'use strict';

var TV_API = 'http://127.0.0.1:8001/api/v2/applications/';
var IPTV = 'https://iptv-org.github.io/iptv/';
var HLS_JS = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
var ROTATE_MS = 8000;
var AMBIENT_MS = 45000;

var K = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, OK: 13, BACK: 10009, ESC: 27, BKSP: 8,
  CH_UP: 427, CH_DOWN: 428, PLAYPAUSE: 10252, PLAY: 415, PAUSE: 19, REW: 412, FF: 417 };

var GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>';

// App IDs come from this TV's installed-app list. `feed` is the TVmaze web channel name.
var APPS = [
  { id: '11101200001', name: 'Netflix', feed: 'Netflix',
    face: 'background:#000', mark: '<span class="wordmark" style="color:#e50914;font-size:2vw;letter-spacing:.04em">NETFLIX</span>' },
  { id: '111299001912', name: 'YouTube', sub: 'Videos, music and live streams',
    face: 'background:#fff', mark: '<span style="display:inline-block;width:2.6vw;height:1.85vw;border-radius:.55vw;background:#f00;position:relative;margin-right:.5vw;vertical-align:middle"><span style="position:absolute;left:1.05vw;top:.55vw;border-left:.75vw solid #fff;border-top:.38vw solid transparent;border-bottom:.38vw solid transparent"></span></span><span class="wordmark" style="color:#0f0f0f;font-size:1.6vw;vertical-align:middle">YouTube</span>' },
  { id: '3201512006785', name: 'Prime Video', feed: 'Prime Video',
    face: 'background:linear-gradient(135deg,#0f171e,#1b2a36)', mark: '<span class="wordmark" style="color:#00a8e1;font-size:1.55vw">prime video</span>' },
  { id: '3201901017640', name: 'Disney+', feed: 'Disney+',
    face: 'background:linear-gradient(135deg,#0b1a4f,#1d4bb5)', mark: '<span class="wordmark" style="font-size:1.9vw">Disney<span style="color:#4fd1ff">+</span></span>' },
  { id: '3201807016597', name: 'Apple TV', feed: 'Apple TV',
    face: 'background:linear-gradient(135deg,#1c1c1e,#3a3a3c)', mark: '<span class="wordmark" style="font-size:1.75vw">Apple TV</span>' },
  { id: 'live', name: 'Live TV', sub: 'Free channels from Italy and around the world',
    face: 'background:linear-gradient(135deg,#ff2d55,#7a1fa2)', mark: '<span class="live-dot"></span><span class="wordmark" style="font-size:1.7vw">Live TV</span>' },
  { id: 'world', name: 'World TV', sub: 'Thousands of free channels by category, from iptv-org',
    face: 'background:linear-gradient(135deg,#0b4f6c,#12a39a)', mark: GLOBE + '<span class="wordmark" style="font-size:1.6vw">World TV</span>' },
  { id: 'classics', name: 'Classics', sub: 'Public domain films from the Internet Archive',
    face: 'background:linear-gradient(135deg,#3b2a1a,#a07c4b)', mark: '<span style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:1.9vw">Classics</span>' },
  { id: '111477001006', name: 'RaiNews', sub: 'Live news',
    face: 'background:linear-gradient(135deg,#00305e,#0a5ca8)', mark: '<span class="wordmark" style="font-size:1.6vw">Rai<span style="font-weight:400">News</span></span>' },
  { id: 'org.tizen.browser', name: 'Internet', sub: 'Web browser',
    face: 'background:linear-gradient(135deg,#1565c0,#42a5f5)', mark: '<span class="wordmark" style="font-size:1.6vw">Internet</span>' }
];

// Italian channels in remote-control order; iptv-org lists everything alphabetically.
var IT_FIRST = ['rai 1', 'rai 2', 'rai 3', 'rete 4', 'canale 5', 'italia 1', 'la7', 'tv8', 'nove', 'rai news 24',
  'sky tg24', 'tgcom24', 'rai 4', 'rai 5', 'rai movie', 'rai premium', 'cielo', 'twentyseven', 'tv2000', 'la7d',
  'real time', 'dmax', 'giallo', 'top crime', 'boing', 'k2', 'rai gulp', 'rai yoyo', 'focus', 'rai storia', 'iris',
  'cine34', 'cartoonito', 'frisbee', 'euronews'];
var WORLD_NEWS = /^(bbc news|bbc world|cnn|al jazeera|france 24|dw|euronews|sky news|bloomberg|nhk world|abc news|cbs news|nbc news|trt world|cna|wion|arirang|i24|africanews|cgtn|tvp world|nasa)/i;
// one flagship per brand leads the World TV news row
var NEWS_FIRST = ['bbc news', 'cnn international', 'al jazeera english', 'france 24 english', 'dw english', 'euronews english',
  'sky news', 'bloomberg', 'nhk world', 'abc news', 'cbs news', 'nbc news', 'trt world', 'cna', 'wion',
  'arirang', 'cgtn', 'africanews', 'i24news english', 'tvp world', 'nasa'];

var LIVE_ROWS = [
  { title: 'Italia', path: 'countries/it.m3u', first: IT_FIRST },
  { title: 'World News', path: 'categories/news.m3u', only: WORLD_NEWS },
  { title: 'United Kingdom', path: 'countries/uk.m3u' },
  { title: 'United States', path: 'countries/us.m3u' },
  { title: 'France', path: 'countries/fr.m3u' },
  { title: 'Spain', path: 'countries/es.m3u' },
  { title: 'Germany', path: 'countries/de.m3u' },
  { title: 'Japan', path: 'countries/jp.m3u' }
];
// iptv-org categories (adult and shopping left out)
var WORLD_ROWS = [['news', 'News'], ['sports', 'Sports'], ['movies', 'Movies'], ['series', 'Series'],
  ['entertainment', 'Entertainment'], ['documentary', 'Documentary'], ['music', 'Music'], ['kids', 'Kids'],
  ['animation', 'Animation'], ['comedy', 'Comedy'], ['science', 'Science'], ['travel', 'Travel'],
  ['cooking', 'Cooking'], ['outdoor', 'Outdoor'], ['culture', 'Culture'], ['education', 'Education'],
  ['lifestyle', 'Lifestyle'], ['classic', 'Classic'], ['family', 'Family'], ['business', 'Business'],
  ['auto', 'Auto'], ['weather', 'Weather'], ['relax', 'Relax'], ['legislative', 'Politics'],
  ['religious', 'Religious'], ['general', 'General']
].map(function (c) { return { title: c[1], path: 'categories/' + c[0] + '.m3u', limit: 60, prefer: c[0] === 'news' ? NEWS_FIRST : null }; });

var H264 = ' AND mediatype:movies AND format:"h.264"';
var FILM_ROWS = [
  { title: 'Great Classics', q: 'collection:feature_films AND licenseurl:*publicdomain* AND -title:(sex OR reefer OR madness)' + H264 },
  { title: 'Film Noir', q: 'collection:Film_Noir' + H264 },
  { title: 'Sci-Fi & Horror', q: 'collection:SciFi_Horror' + H264 },
  { title: 'Silent Era', q: 'collection:silent_films' + H264 }
];

// ---------- helpers ----------
function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function stripHtml(s) { return String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
function clip(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; }
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function getJSON(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
function getText(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }); }
function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
function shuffle(a) {
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

function cached(key, maxAgeMs, load) {
  try {
    var hit = JSON.parse(localStorage.getItem(key));
    if (hit && Date.now() - hit.t < maxAgeMs) return Promise.resolve(hit.v);
  } catch (e) {}
  return load().then(function (v) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {}
    return v;
  });
}

var toastTimer;
function toast(msg) {
  $('toast').textContent = msg;
  $('toast').className = 'toast on';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { $('toast').className = 'toast'; }, 2400);
}

// TizenBrew pages have no `tizen` API; the TV's REST API opens apps without a token.
function openApp(app) {
  toast('Opening ' + app.name);
  fetch(TV_API + app.id, { method: 'POST', mode: 'no-cors' })
    .catch(function () { toast('Could not open ' + app.name); });
}

// ---------- background + liquid glass ----------
// Chrome 56 has no backdrop-filter, so every .glass panel holds its own copy of the
// background, sized and offset in px to line up with the full-screen one, then blurred.
var VW, VH, M;
var glasses = [];
var bg = { url: null, front: 0, soft: false, credit: '', geo: null };

function initGlass() {
  VW = window.innerWidth;
  VH = window.innerHeight;
  M = Math.round(VW * 0.03); // room for the blur to bleed past the panel edge
  glasses = [].slice.call(document.querySelectorAll('.glass')).map(function (el) {
    var r = el.getBoundingClientRect(), layers = el.querySelectorAll('.gl');
    for (var i = 0; i < layers.length; i++) {
      var s = layers[i].style;
      s.left = s.top = -M + 'px';
      s.width = (r.width + 2 * M) + 'px';
      s.height = (r.height + 2 * M) + 'px';
    }
    return { L: r.left, T: r.top, layers: layers };
  });
}

function paint(el, css, g, dx, dy) {
  el.style.backgroundImage = css;
  el.style.backgroundSize = g.w + 'px ' + g.h + 'px';
  el.style.backgroundPosition = (g.x + dx) + 'px ' + (g.y + dy) + 'px';
}

function setBackground(url, soft, credit) {
  if (!url || url === bg.url) return;
  bg.url = url;
  var img = new Image();
  img.onload = function () {
    if (bg.url !== url) return;
    var s = Math.max(VW / img.naturalWidth, VH / img.naturalHeight);
    var g = { w: img.naturalWidth * s, h: img.naturalHeight * s };
    g.x = (VW - g.w) / 2;
    g.y = (VH - g.h) * 0.35;
    var css = 'url("' + url.replace(/"/g, '%22') + '")', next = 1 - bg.front, prev = bg.front;
    paint($('bg' + next), css, g, 0, 0);
    $('bg' + next).className = 'bg on' + (soft ? ' soft' : '');
    $('bg' + prev).className = 'bg' + (bg.soft ? ' soft' : '');
    glasses.forEach(function (gl) {
      paint(gl.layers[next], css, g, M - gl.L, M - gl.T);
      gl.layers[next].className = 'gl on';
      gl.layers[prev].className = 'gl';
    });
    bg.front = next;
    bg.soft = soft;
    bg.credit = credit;
    bg.geo = g;
    $('credit').textContent = credit || '';
  };
  img.src = url;
}

// Frame-style ambient photos: Wikimedia Commons featured landscapes (CC licensed, credited on screen).
var ambient = [], ambientIdx = 0, ambientOn = true;

function loadAmbient() {
  return cached('home.art', 24 * 3600e3, function () {
    var u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=categorymembers' +
      '&gcmtype=file&gcmlimit=60&gcmtitle=' + encodeURIComponent('Category:Featured pictures of landscapes') +
      '&prop=imageinfo&iiprop=url|size|extmetadata&iiextmetadatafilter=Artist|LicenseShortName&iiurlwidth=1920';
    return getJSON(u).then(function (r) {
      var pages = r.query ? Object.keys(r.query.pages).map(function (k) { return r.query.pages[k]; }) : [];
      return pages.filter(function (p) {
        var i = p.imageinfo && p.imageinfo[0];
        return i && i.thumburl && i.width > i.height * 1.3;
      }).map(function (p) {
        var i = p.imageinfo[0], m = i.extmetadata || {};
        return { url: i.thumburl, credit: 'Photo: ' + clip(stripHtml(m.Artist && m.Artist.value), 40) + ' · ' +
          stripHtml(m.LicenseShortName && m.LicenseShortName.value) + ' · Wikimedia Commons' };
      });
    });
  }).then(function (list) {
    ambient = shuffle(list);
    if (ambientOn) showAmbient();
  }).catch(function () {});
}

function showAmbient() {
  ambientOn = true;
  if (!ambient.length) return;
  var a = ambient[ambientIdx % ambient.length];
  setBackground(a.url, false, a.credit);
}

// TVmaze widescreen backdrops, looked up once per show
var backdrops = {};
function backdrop(it) {
  if (!backdrops[it.sid]) {
    backdrops[it.sid] = getJSON('https://api.tvmaze.com/shows/' + it.sid + '/images').then(function (imgs) {
      var b = imgs.filter(function (i) { return i.type === 'background' && i.resolutions && i.resolutions.original; })
        .sort(function (a, c) {
          return Math.abs(a.resolutions.original.width - 1920) - Math.abs(c.resolutions.original.width - 1920);
        })[0];
      return b ? b.resolutions.original.url : null;
    }).catch(function () { return null; });
  }
  return backdrops[it.sid];
}

var bgTimer;
function backgroundFor(it) {
  clearTimeout(bgTimer);
  // wait until focus settles so scrolling past posters doesn't download every backdrop
  bgTimer = setTimeout(function () {
    if (!it || it.kind === 'channel') return showAmbient();
    ambientOn = false;
    if (it.kind === 'film') return setBackground(it.image, true, 'Internet Archive · public domain');
    backdrop(it).then(function (url) {
      if (currentItem() !== it) return;
      if (url) setBackground(url, false, 'Image: TVmaze');
      else setBackground(it.art, true, 'Image: TVmaze');
    });
  }, 350);
}

// ---------- data: new shows (TVmaze, CC BY-SA) ----------
function loadNewShows() {
  return cached('home.shows2', 3 * 3600e3, function () {
    var days = [0, 1, 2, 3, 4, 5].map(function (d) { return new Date(Date.now() - d * 864e5).toISOString().slice(0, 10); });
    return Promise.all(days.map(function (d) {
      return getJSON('https://api.tvmaze.com/schedule/web?date=' + d).catch(function () { return []; });
    })).then(function (lists) {
      var feeds = {};
      APPS.forEach(function (a) { if (a.feed) feeds[a.feed] = {}; });
      [].concat.apply([], lists).forEach(function (ep) {
        var s = ep._embedded && ep._embedded.show;
        if (!s || !s.webChannel || !s.image || !feeds[s.webChannel.name]) return;
        var seen = feeds[s.webChannel.name][s.id];
        if (seen && seen.airdate >= ep.airdate) return;
        var isNew = s.premiered && Date.now() - Date.parse(s.premiered) < 21 * 864e5;
        feeds[s.webChannel.name][s.id] = {
          kind: 'show', sid: s.id, title: s.name, weight: s.weight || 0, airdate: ep.airdate,
          image: s.image.medium, art: s.image.original,
          kicker: isNew ? 'New series' : 'New episode',
          meta: [isNew ? null : 'S' + ep.season + ' · E' + ep.number, (s.genres || []).slice(0, 3).join(', '),
            s.rating && s.rating.average ? '★ ' + s.rating.average : null].filter(Boolean).join('   ·   '),
          summary: clip(stripHtml(s.summary), 260)
        };
      });
      var out = {};
      Object.keys(feeds).forEach(function (f) {
        out[f] = Object.keys(feeds[f]).map(function (k) { return feeds[f][k]; })
          .sort(function (a, b) { return b.weight - a.weight; }).slice(0, 16);
      });
      return out;
    });
  });
}

// ---------- data: live TV (iptv-org public playlists) ----------
function parseM3U(text) {
  var lines = text.split('\n'), out = [];
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('#EXTINF') !== 0) continue;
    var url = (lines[i + 1] || '').trim();
    if (!url || url[0] === '#') continue;
    var raw = lines[i].slice(lines[i].lastIndexOf(',') + 1).trim();
    out.push({
      kind: 'channel', url: url,
      image: (lines[i].match(/tvg-logo="([^"]*)"/) || [])[1],
      title: raw.replace(/\s*\[[^\]]*\]/g, '').replace(/\s*\(\d+p\)/g, '').trim(),
      res: +((raw.match(/\((\d+)p\)/) || [])[1] || 0),
      flaky: /\[(not 24\/7|geo-blocked)\]/i.test(raw)
    });
  }
  return out;
}

function rankedBy(list, score) {
  // index tiebreak: Chrome 56's sort isn't stable
  return list.map(function (c, i) { return { c: c, s: score(c), i: i }; })
    .sort(function (a, b) { return a.s - b.s || a.i - b.i; })
    .map(function (x) { return x.c; });
}

var liveCache = {};
function loadLiveRow(row) {
  if (liveCache[row.path]) return liveCache[row.path];
  liveCache[row.path] = getText(IPTV + row.path).then(function (text) {
    var list = parseM3U(text);
    if (row.only) list = list.filter(function (c) { return row.only.test(c.title); });
    if (row.first) {
      list = rankedBy(list, function (c) {
        var i = row.first.indexOf(c.title.toLowerCase().replace(/\s+(hd|sd|fhd)$/, ''));
        return i < 0 ? row.first.length : i;
      });
    } else {
      // dependable, well-known, sharp channels with logos first
      var brand = function (c) {
        var t = c.title.toLowerCase(), p = 0;
        if (row.prefer) for (; p < row.prefer.length && t.indexOf(row.prefer[p]) !== 0; p++);
        return p;
      };
      list = rankedBy(list, function (c) { return (c.flaky ? 1e6 : 0) + brand(c) * 1e4 + (c.image ? 0 : 5e3) - c.res; });
      if (row.prefer) {
        // one channel per brand up front, their regional variants after
        var lead = [], rest = [], seen = {};
        list.forEach(function (c) {
          var b = brand(c);
          if (b < row.prefer.length && !seen[b]) { seen[b] = 1; lead.push(c); } else rest.push(c);
        });
        list = lead.concat(rest);
      }
    }
    var names = {};
    return list.filter(function (c) {
      var key = c.title.toLowerCase().replace(/\s+(hd|sd|fhd)$/, '');
      return !names[key] && (names[key] = 1);
    }).slice(0, row.limit || 40).map(function (c) { c.sub = 'Live · ' + row.title; return c; });
  });
  return liveCache[row.path];
}

// ---------- data: public domain films (Internet Archive) ----------
var filmCache = {};
function loadFilmRow(row) {
  if (filmCache[row.q]) return filmCache[row.q];
  var url = 'https://archive.org/advancedsearch.php?q=' + encodeURIComponent(row.q) +
    '&fl[]=identifier&fl[]=title&fl[]=year&fl[]=description&rows=36&output=json&sort[]=downloads+desc';
  filmCache[row.q] = getJSON(url).then(function (r) {
    return r.response.docs.map(function (d) {
      var desc = Array.isArray(d.description) ? d.description[0] : d.description;
      return { kind: 'film', id: d.identifier, title: String(d.title).replace(/\s*\(\d{4}\)\s*$/, ''),
        sub: [d.year, 'Public domain'].filter(Boolean).join(' · '),
        image: 'https://archive.org/services/img/' + encodeURIComponent(d.identifier),
        summary: clip(stripHtml(desc), 240) };
    });
  });
  return filmCache[row.q];
}

function filmSource(film) {
  return getJSON('https://archive.org/metadata/' + encodeURIComponent(film.id) + '/files').then(function (m) {
    var mp4 = (m.result || []).filter(function (f) { return /\.mp4$/i.test(f.name); });
    var best = mp4.filter(function (f) { return f.format === 'h.264'; })[0] || mp4[0];
    if (!best) throw new Error('no mp4');
    return 'https://archive.org/download/' + encodeURIComponent(film.id) + '/' + encodeURIComponent(best.name);
  });
}

// ---------- weather (Open-Meteo, location from IP) and news (BBC via rss2json) ----------
var CLOUD_UP = '<path d="M7 14h10a4 4 0 0 0 .4-7.98A6 6 0 0 0 5.9 5.6 4.2 4.2 0 0 0 7 14z"/>';
var ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  partly: '<circle cx="8" cy="8" r="3"/><path d="M8 2v1.5M2 8h1.5M3.8 3.8l1 1M12.2 3.8l-1 1M9 19h8a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.6 1.4A2.9 2.9 0 0 0 9 19z"/>',
  cloud: '<path d="M7 17h10a4 4 0 0 0 .4-7.98A6 6 0 0 0 5.9 8.6 4.2 4.2 0 0 0 7 17z"/>',
  fog: '<path d="M4 9h16M3 13h18M5 17h14"/>',
  rain: CLOUD_UP + '<path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/>',
  snow: CLOUD_UP + '<path d="M8 18h.01M12 19h.01M16 18h.01M10 21h.01M14 21h.01" stroke-width="2.6"/>',
  storm: CLOUD_UP + '<path d="M13 15l-3 4h4l-3 4"/>'
};
function wmo(code, day) {
  if (code <= 2) return code === 0 ? [day ? 'sun' : 'moon', 'Clear'] : [day ? 'partly' : 'moon', 'Partly cloudy'];
  if (code === 3) return ['cloud', 'Cloudy'];
  if (code === 45 || code === 48) return ['fog', 'Fog'];
  if (code >= 95) return ['storm', 'Thunderstorm'];
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ['snow', 'Snow'];
  if (code >= 51 && code <= 57) return ['rain', 'Drizzle'];
  return ['rain', 'Rain'];
}

function loadWeather() {
  cached('home.geo', 24 * 3600e3, function () { return getJSON('https://get.geojs.io/v1/ip/geo.json'); })
    .then(function (g) {
      return getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + g.latitude + '&longitude=' + g.longitude +
        '&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto')
        .then(function (w) {
          var c = w.current, k = wmo(c.weather_code, c.is_day);
          $('weather').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
            ICONS[k[0]] + '</svg><span class="temp">' + Math.round(c.temperature_2m) + '°</span>' +
            '<span class="wx-sub">' + esc(k[1]) + ' · ' + esc(g.city || '') + '<br>H ' + Math.round(w.daily.temperature_2m_max[0]) +
            '°  L ' + Math.round(w.daily.temperature_2m_min[0]) + '°</span>';
          $('weather').className = 'weather on';
        });
    })
    .catch(function () {});
}

function loadNews() {
  var feed = 'https://feeds.bbci.co.uk/news/world/rss.xml';
  cached('home.news', 30 * 60e3, function () {
    return getJSON('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feed)).then(function (r) {
      return r.items.slice(0, 12).map(function (i) { return i.title; });
    });
  }).then(function (titles) {
    var t = $('tickerText');
    t.innerHTML = titles.map(function (h) { return '<span>' + esc(h) + '</span><b>•</b>'; }).join('');
    // constant reading speed whatever the number of headlines
    t.style.animationDuration = Math.round((t.scrollWidth + window.innerWidth) / (window.innerWidth * 0.06)) + 's';
    $('ticker').className = 'ticker on';
  }).catch(function () {});
}

// ---------- home screen ----------
var screen = 'home';
var zone = 'dock';
var appIndex = 0, itemIndex = 0, heroIndex = 0;
var shows = {};
var rowItems = [];

try { appIndex = Math.min(+localStorage.getItem('home.app') || 0, APPS.length - 1); } catch (e) {}

function renderDock() {
  $('dock').innerHTML = APPS.map(function (a, i) {
    return '<div class="tile" style="animation-delay:' + (i * 60) + 'ms"><div class="tile-face shine" style="' + a.face + '">' +
      a.mark + '</div><div class="tile-name">' + a.name + '</div></div>';
  }).join('');
}

function cardHtml(it) {
  if (it.kind === 'show') {
    return '<div class="poster shine"><img src="' + esc(it.image) + '" alt=""></div>';
  }
  var img = it.image
    ? '<img class="' + (it.kind === 'film' ? 'cover' : 'logo') + '" src="' + esc(it.image) + '" alt="" onerror="this.style.display=\'none\'">'
    : '';
  return '<div class="card-wrap"><div class="card shine">' + img + (it.kind === 'channel' ? '<span class="live">LIVE</span>' : '') +
    '</div><div class="card-title">' + esc(it.title) + '</div></div>';
}

function itemsFor(app) {
  if (app.feed) return Promise.resolve(shows[app.feed] || []);
  if (app.id === 'live') return loadLiveRow(LIVE_ROWS[0]);
  if (app.id === 'world') return loadLiveRow(WORLD_ROWS[0]);
  if (app.id === 'classics') return loadFilmRow(FILM_ROWS[0]);
  return Promise.resolve([]);
}

function rowLabelFor(app) {
  if (app.feed) return 'New on ' + app.name;
  if (app.id === 'live') return 'On now · Italia';
  if (app.id === 'world') return 'News from around the world';
  if (app.id === 'classics') return 'Great Classics';
  return '';
}

function renderRow() {
  var app = APPS[appIndex];
  var forIndex = appIndex;
  rowItems = [];
  $('row').innerHTML = '';
  $('rowLabel').textContent = '';
  itemsFor(app).then(function (items) {
    if (forIndex !== appIndex) return;
    rowItems = items;
    $('rowLabel').textContent = items.length ? rowLabelFor(app) : '';
    $('row').innerHTML = items.map(cardHtml).join('');
    paintFocus();
    heroIndex = 0;
    showHero();
  }).catch(function () {});
}

function currentItem() {
  return zone === 'row' ? rowItems[itemIndex] : rowItems[heroIndex % (rowItems.length || 1)];
}

function showHero() {
  var app = APPS[appIndex], it = currentItem(), h = $('hero');
  if (!it) {
    h.innerHTML = '<div class="kicker">' + esc(app.name) + '</div><div class="hero-title">' + esc(app.name) +
      '</div><div class="hero-summary">' + esc(app.sub || '') + '</div>';
    $('heroArt').innerHTML = '';
  } else {
    var kicker = it.kind === 'show' ? app.name + ' · ' + it.kicker : it.kind === 'channel' ? 'Live now' : 'Classic film';
    var meta = it.kind === 'show' ? it.meta : it.sub;
    h.innerHTML = '<div class="kicker">' + esc(kicker) + '</div><div class="hero-title">' + esc(it.title) + '</div>' +
      '<div class="hero-meta">' + esc(meta || '') + '</div><div class="hero-summary">' + esc(it.summary || '') + '</div>';
    $('heroArt').innerHTML = it.image
      ? '<img class="' + (it.kind === 'channel' ? 'logo' : '') + '" src="' + esc(it.kind === 'show' ? it.art : it.image) + '" alt="" onerror="this.style.display=\'none\'">'
      : '';
  }
  restart(h, 'swap');
  restart($('heroArt'), 'swap');
  backgroundFor(it);
}

function scrollStrip(el, index, step, visible) {
  var shift = Math.max(0, (index + 1) * step - visible + 3);
  el.style.transform = 'translateX(' + -shift + 'vw)';
}

function paintFocus() {
  var tiles = $('dock').children;
  for (var i = 0; i < tiles.length; i++) tiles[i].classList.toggle('focused', zone === 'dock' && i === appIndex);
  var cards = $('row').children;
  for (var j = 0; j < cards.length; j++) cards[j].classList.toggle('focused', zone === 'row' && j === itemIndex);
  scrollStrip($('dock'), appIndex, 14.3, 90.6);
  var step = rowItems[0] && rowItems[0].kind === 'show' ? 8.7 : 16.5;
  scrollStrip($('row'), zone === 'row' ? itemIndex : 0, step, 90.6);
}

function selectApp(i) {
  appIndex = Math.max(0, Math.min(APPS.length - 1, i));
  try { localStorage.setItem('home.app', appIndex); } catch (e) {}
  paintFocus();
  renderRow();
  showHero();
}

function startTimers() {
  setInterval(function () {
    if (screen === 'home' && zone === 'dock' && rowItems.length > 1) { heroIndex++; showHero(); }
  }, ROTATE_MS);
  setInterval(function () {
    if (screen === 'home' && ambientOn && ambient.length) { ambientIdx++; showAmbient(); }
  }, AMBIENT_MS);
}

function activate(it, list, i) {
  if (!it || it.kind === 'show') return openApp(APPS[appIndex]);
  play(list, i, 'home');
}

function homeKey(k) {
  var app = APPS[appIndex];
  if (k === K.LEFT) {
    if (zone === 'dock') selectApp(appIndex - 1);
    else if (itemIndex > 0) { itemIndex--; paintFocus(); showHero(); }
  } else if (k === K.RIGHT) {
    if (zone === 'dock') selectApp(appIndex + 1);
    else if (itemIndex < rowItems.length - 1) { itemIndex++; paintFocus(); showHero(); }
  } else if (k === K.UP) {
    if (zone === 'dock' && rowItems.length) { zone = 'row'; itemIndex = 0; paintFocus(); showHero(); }
  } else if (k === K.DOWN) {
    if (zone === 'row') { zone = 'dock'; paintFocus(); showHero(); }
  } else if (k === K.OK) {
    if (zone === 'row') activate(rowItems[itemIndex], rowItems, itemIndex);
    else if (app.id === 'live') openBrowse('Live TV', 'Free channels from Italy and around the world · iptv-org', LIVE_ROWS, loadLiveRow);
    else if (app.id === 'world') openBrowse('World TV', 'Free public channels by category · iptv-org', WORLD_ROWS, loadLiveRow);
    else if (app.id === 'classics') openBrowse('Classics', 'Public domain films from the Internet Archive', FILM_ROWS, loadFilmRow);
    else openApp(app);
  } else return false;
  return true;
}

// ---------- browse screen (Live TV / World TV / Classics) ----------
var browse = { rows: [], items: [], row: 0, col: [], loader: null, asked: [] };

function openBrowse(title, sub, rows, loader) {
  screen = 'browse';
  browse = { rows: rows, items: rows.map(function () { return []; }), row: 0,
    col: rows.map(function () { return 0; }), loader: loader, asked: [] };
  var front = $('bg' + bg.front);
  $('browseBg').style.backgroundImage = front.style.backgroundImage;
  $('browseBg').style.backgroundSize = front.style.backgroundSize;
  $('browseBg').style.backgroundPosition = front.style.backgroundPosition;
  $('browseTitle').textContent = title;
  $('browseSub').textContent = sub;
  $('browseRows').innerHTML = rows.map(function (r, i) {
    return '<div class="brow"><div class="brow-label">' + esc(r.title) + '</div><div class="strip" id="brow' + i + '"><div class="row-empty">Loading…</div></div></div>';
  }).join('');
  $('browse').className = 'screen on';
  paintBrowse();
}

// Only fetch the rows on screen and just below, so 26 categories don't all download at once.
function loadNearbyRows() {
  for (var i = Math.max(0, browse.row - 1); i <= Math.min(browse.rows.length - 1, browse.row + 2); i++) {
    if (browse.asked[i]) continue;
    browse.asked[i] = true;
    (function (i, rows) {
      browse.loader(rows[i]).then(function (items) {
        if (browse.rows !== rows) return;
        browse.items[i] = items;
        $('brow' + i).innerHTML = items.length ? items.map(cardHtml).join('') : '<div class="row-empty">Nothing available right now</div>';
        paintBrowse();
      }).catch(function () {
        if (browse.rows === rows) $('brow' + i).innerHTML = '<div class="row-empty">Could not load this list</div>';
      });
    })(i, browse.rows);
  }
}

function paintBrowse() {
  loadNearbyRows();
  for (var r = Math.max(0, browse.row - 2); r <= Math.min(browse.rows.length - 1, browse.row + 2); r++) {
    var strip = $('brow' + r), kids = strip.children;
    for (var c = 0; c < kids.length; c++) kids[c].classList.toggle('focused', r === browse.row && c === browse.col[r]);
    scrollStrip(strip, browse.col[r], 16.5, 90.6);
  }
  $('browseRows').style.transform = 'translateY(' + -Math.max(0, browse.row - 1) * 14.2 + 'vw)';
}

function browseKey(k) {
  var r = browse.row, n = browse.items[r].length;
  if (k === K.LEFT) browse.col[r] = Math.max(0, browse.col[r] - 1);
  else if (k === K.RIGHT) browse.col[r] = Math.min(Math.max(0, n - 1), browse.col[r] + 1);
  else if (k === K.UP) browse.row = Math.max(0, r - 1);
  else if (k === K.DOWN) browse.row = Math.min(browse.rows.length - 1, r + 1);
  else if (k === K.OK) { if (n) play(browse.items[r], browse.col[r], 'browse'); return true; }
  else if (isBack(k)) { closeBrowse(); return true; }
  else return false;
  paintBrowse();
  return true;
}

function closeBrowse() {
  screen = 'home';
  $('browse').className = 'screen';
}

// ---------- player ----------
var video = $('video');
var player = { list: [], i: 0, from: 'home' };
var hls = null, hlsLoading = null, bannerTimer, barTimer, stallTimer;

function loadHls() {
  if (window.Hls) return Promise.resolve(window.Hls);
  if (!hlsLoading) {
    hlsLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = HLS_JS;
      s.onload = function () { resolve(window.Hls); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return hlsLoading;
}

function setMsg(text) { $('msg').textContent = text || ''; $('msg').className = text ? 'msg on' : 'msg'; }
function setSpin(on) { $('spinner').className = on ? 'spinner on' : 'spinner'; }

function stopVideo() {
  clearTimeout(stallTimer);
  if (hls) { hls.destroy(); hls = null; }
  video.pause();
  video.removeAttribute('src');
  video.load();
}

function fail() { setSpin(false); setMsg(player.list[player.i].kind === 'channel' ? 'This channel is unavailable · press ▲ ▼ for another' : 'This film could not be played'); }

function setSource(url) {
  stopVideo();
  setSpin(true);
  setMsg('');
  stallTimer = setTimeout(fail, 20000);
  var isHls = /\.m3u8(\?|$)/i.test(url);
  // Tizen's video element plays HLS itself; desktop browsers may need hls.js.
  if (!isHls || video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.play().catch(function () {});
    return;
  }
  loadHls().then(function (Hls) {
    if (!Hls.isSupported()) return fail();
    hls = new Hls();
    hls.on(Hls.Events.ERROR, function (e, d) { if (d.fatal) fail(); });
    hls.loadSource(url);
    hls.attachMedia(video);
    video.play().catch(function () {});
  }).catch(fail);
}

function showBanner() {
  var it = player.list[player.i];
  $('banner').innerHTML = (it.image ? '<img src="' + esc(it.image) + '" alt="" onerror="this.style.display=\'none\'">' : '') +
    '<div><div class="banner-title">' + esc(it.title) + '</div><div class="banner-sub">' + esc(it.sub || '') +
    (it.kind === 'channel' ? '   ·   ▲ ▼ change channel' : '   ·   ◀ ▶ skip 30s   ·   OK pause') + '</div></div>';
  $('banner').className = 'banner on';
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(function () { $('banner').className = 'banner'; }, 5000);
}

function showBar() {
  if (player.list[player.i].kind !== 'film' || !video.duration) return;
  $('bar').className = 'bar on';
  clearTimeout(barTimer);
  barTimer = setTimeout(function () { if (!video.paused) $('bar').className = 'bar'; }, 4000);
}

function fmt(t) {
  t = Math.max(0, Math.floor(t || 0));
  var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
  return (h ? h + ':' + pad2(m) : m) + ':' + pad2(s);
}

function play(list, i, from) {
  player = { list: list, i: i, from: from };
  screen = 'player';
  $('player').className = 'screen on';
  $('bar').className = 'bar';
  startItem();
}

function startItem() {
  var it = player.list[player.i];
  showBanner();
  if (it.kind === 'film') {
    stopVideo();
    setSpin(true);
    filmSource(it).then(setSource).catch(fail);
  } else {
    setSource(it.url);
  }
}

function zap(d) {
  var n = player.list.length;
  player.i = (player.i + d + n) % n;
  startItem();
}

function closePlayer() {
  stopVideo();
  setSpin(false);
  setMsg('');
  $('player').className = 'screen';
  screen = player.from;
}

function isBack(k) { return k === K.BACK || k === K.ESC || k === K.BKSP; }

function playerKey(k) {
  var it = player.list[player.i];
  if (isBack(k)) closePlayer();
  else if (it.kind === 'channel') {
    if (k === K.UP || k === K.CH_UP) zap(1);
    else if (k === K.DOWN || k === K.CH_DOWN) zap(-1);
    else if (k === K.OK || k === K.LEFT || k === K.RIGHT) showBanner();
    else return false;
  } else {
    if (k === K.LEFT || k === K.REW) { video.currentTime = Math.max(0, video.currentTime - 30); showBar(); }
    else if (k === K.RIGHT || k === K.FF) { video.currentTime = Math.min(video.duration || 0, video.currentTime + 30); showBar(); }
    else if (k === K.OK || k === K.PLAYPAUSE || k === K.PLAY || k === K.PAUSE) {
      if (video.paused) video.play().catch(function () {}); else video.pause();
      showBar(); showBanner();
    } else if (k === K.UP || k === K.DOWN) { showBar(); showBanner(); }
    else return false;
  }
  return true;
}

video.addEventListener('playing', function () { clearTimeout(stallTimer); setSpin(false); setMsg(''); showBar(); });
video.addEventListener('waiting', function () { setSpin(true); });
video.addEventListener('error', function () { if (screen === 'player' && video.getAttribute('src')) fail(); });
video.addEventListener('timeupdate', function () {
  if (!video.duration || !isFinite(video.duration)) return;
  $('barFill').style.width = (video.currentTime / video.duration * 100) + '%';
  $('barNow').textContent = fmt(video.currentTime);
  $('barEnd').textContent = '-' + fmt(video.duration - video.currentTime);
});
video.addEventListener('pause', function () { if (screen === 'player') showBar(); });

// ---------- input ----------
document.addEventListener('keydown', function (e) {
  var k = e.keyCode, handled;
  if (screen === 'player') handled = playerKey(k);
  else if (screen === 'browse') handled = browseKey(k);
  else handled = homeKey(k);
  if (handled) e.preventDefault();
});

window.addEventListener('resize', function () {
  initGlass();
  var u = bg.url;
  bg.url = null;
  setBackground(u, bg.soft, bg.credit);
});

// ---------- clock ----------
function tick() {
  var d = new Date(), h = d.getHours();
  $('clock').textContent = h + ':' + pad2(d.getMinutes());
  $('greet').textContent = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  $('date').textContent = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ---------- start ----------
initGlass();
renderDock();
tick();
setInterval(tick, 10000);
selectApp(appIndex);
startTimers();
loadAmbient();
loadNewShows().then(function (s) { shows = s; renderRow(); }).catch(function () {});
loadWeather();
loadNews();
setInterval(loadWeather, 30 * 60e3);
setInterval(loadNews, 30 * 60e3);
