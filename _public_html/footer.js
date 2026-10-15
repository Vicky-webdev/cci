(function () {

  /* ============================================================
     FOOTER.JS — Crafts Council of India
     Injects the Instagram feed + footer on every page.

     HOW TO USE:
     1. In each HTML page, remove the entire <div class="insta-section">
        block and the entire <footer>...</footer> block.
     2. Replace them with just two lines:
            <div id="site-footer"></div>
            <script src="footer.js"></script>
     3. That's it. Edit this file once → updates everywhere.

     HOW TO UPDATE LINKS:
     Edit the NAV_LINKS, RESOURCE_LINKS or ARCHIVE_LINKS arrays below.
  ============================================================ */

  /* ── NAVIGATION COLUMNS ─────────────────────────────────── */
  var NAV_LINKS = [
    { label: 'About',        href: 'about.html' },
    { label: 'What We Do',   href: 'what-we-do.html' },
    { label: 'Recognition',  href: 'awards.html' },
    { label: 'Events',       href: 'events.html' },
    { label: 'News',         href: 'news.html' },
    { label: 'Contact',      href: 'contact.html' }
  ];

  var RESOURCE_LINKS = [
    { label: 'Books',                   href: 'books.html' },
    { label: 'Newsletters',             href: 'newsletters.html' },
    { label: 'Reports',                 href: 'reports.html' },
    { label: 'Crafts Map of India',     href: 'crafts-map.html' },
    { label: 'Happenings in Handmade',     href: 'happenings-in-handmade.html' }
  ];

  var ARCHIVE_LINKS = [
    { label: 'Facebook',  href: 'https://facebook.com/craftscouncilofindia' },
    { label: 'Instagram',   href: 'https://instagram.com/craftscouncilofindia' },
    { label: 'YouTube',      href: 'https://www.youtube.com/@thecraftscouncilofindia6335' },
    { label: 'LinkedIn',   href: 'https://linkedin.com/company/craftscouncilofindia' }
  ];

  /* ── CONTACT DETAILS ────────────────────────────────────── */
  var ADDRESS = [
    'GF, Temple Trees Apartments',
    '37 Venkatanarayana Road, T. Nagar',
    'Chennai \u2013 600017, Tamil Nadu'
  ].join('<br>');

  var EMAIL   = 'info@craftscouncilofindia.in';
  var PHONE   = '+91-44-24341456';

  /* ── SOCIAL LINKS ───────────────────────────────────────── */
  var SOCIALS = [
    {
      title: 'Facebook',
      href:  'https://facebook.com/craftscouncilofindia',
      svg:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    },
    {
      title: 'Instagram',
      href:  'https://instagram.com/craftscouncilofindia',
      svg:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>'
    },
    {
      title: 'YouTube',
      href:  'https://www.youtube.com/@thecraftscouncilofindia6335',
      svg:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    },
    {
      title: 'LinkedIn',
      href:  'https://linkedin.com/company/craftscouncilofindia',
      svg:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
    }
  ];

  /* ── BEHOLD INSTAGRAM FEED URL ──────────────────────────── */
  var BEHOLD_URL = 'https://feeds.behold.so/nUTFUE5VrVvIS91W91Ta';

  /* ── HELPERS ────────────────────────────────────────────── */
  function links(arr) {
    return arr.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + '</a>';
    }).join('');
  }

  function socialIcons() {
    return SOCIALS.map(function (s) {
      return '<a href="' + s.href + '" target="_blank" rel="noopener" class="f-social" title="' + s.title + '">' + s.svg + '</a>';
    }).join('');
  }

  /* ── BUILD HTML ─────────────────────────────────────────── */
  var html =

    /* ── INSTAGRAM SECTION ── */
    '<div class="insta-section">' +
      '<div class="insta-header">' +
        '<div>' +
          '<p class="eyebrow">Follow our journey</p>' +
          '<h2 class="s-title" style="color:#FAF6EF;font-family:\'Cormorant Garamond\',serif">On Instagram</h2>' +
        '</div>' +
        '<a href="https://www.instagram.com/craftscouncilofindia" target="_blank" rel="noopener" style="text-decoration:none">' +
          '<div class="insta-handle">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.5)" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' +
            '<span class="ig-handle-text">@craftscouncilofindia</span>' +
          '</div>' +
        '</a>' +
      '</div>' +
      '<div id="footer-ig-grid" class="insta-grid">' +
        '<div class="ig-post ig-skeleton"></div>' +
        '<div class="ig-post ig-skeleton"></div>' +
        '<div class="ig-post ig-skeleton"></div>' +
        '<div class="ig-post ig-skeleton"></div>' +
        '<div class="ig-post ig-skeleton"></div>' +
        '<div class="ig-post ig-skeleton"></div>' +
      '</div>' +
      '<p class="insta-note" id="footer-ig-status">Loading latest posts...</p>' +
    '</div>' +

    /* ── FOOTER ── */
    '<footer>' +
      '<div class="footer-top">' +

        /* Brand + address */
        '<div>' +
          '<div class="f-brand">Crafts Council of India</div>' +
          '<div class="f-addr">' +
            ADDRESS +
            '<br><br>' +
            '<a href="mailto:' + EMAIL + '" style="color:inherit;text-decoration:none">' + EMAIL + '</a>' +
            '<br>' + PHONE +
          '</div>' +
        '</div>' +

        /* Navigate */
        '<div class="f-col"><div class="f-col-title">Quick Links</div>' + links(NAV_LINKS) + '</div>' +

        /* Resources */
        '<div class="f-col"><div class="f-col-title">Resources</div>' + links(RESOURCE_LINKS) + '</div>' +

        /* Archive */
        '<div class="f-col"><div class="f-col-title">Connect</div>' + links(ARCHIVE_LINKS) + '</div>' +

      '</div>' +
     '<div class="footer-bottom">' +
        '<div class="f-copy">' +
          '<span>&copy; Crafts Council of India, 2026. All rights reserved.</span>' +
          '<span class="f-legal-links">' +
            ' <a href="privacy-policy.html">Privacy Policy</a> ' +
            ' <a href="disclaimer.html">Terms of Use</a>' +
          '</span>' +
        '</div>' +
        '<div class="f-socials">' + socialIcons() + '</div>' +
      '</div>' +
    '</footer>';

  /* ── INJECT ─────────────────────────────────────────────── */
  var target = document.getElementById('site-footer');
  if (target) {
    target.innerHTML = html;
  } else {
    /* fallback: append before </body> if placeholder div missing */
    document.body.insertAdjacentHTML('beforeend', html);
  }

  /* ── INSTAGRAM FEED ─────────────────────────────────────────
     Behold (free plan) has a monthly view limit, and every feed
     request counts. To stay under it:
       • the feed is only requested when the footer scrolls near view
       • the result is cached in the browser for 6 hours, so moving
         between pages doesn't re-request it
     If Behold fails (e.g. 402 "limit reached"), a recent cached feed
     is shown, otherwise a static grid of site photos linking to the
     Instagram profile — never the endless grey placeholders.        */
  var grid   = document.getElementById('footer-ig-grid');
  var status = document.getElementById('footer-ig-status');

  var IG_PROFILE    = 'https://www.instagram.com/craftscouncilofindia';
  var IG_CACHE_KEY  = 'cci_ig_feed_v1';
  var IG_FRESH_MS   = 6 * 60 * 60 * 1000;       // reuse without refetching
  var IG_STALE_MS   = 3 * 24 * 60 * 60 * 1000;  // fallback if Behold is down (Instagram image links expire after a few days)

  var IG_FALLBACK = [
    'images/promote1.webp', 'images/sustain1.webp', 'images/support2.webp',
    'images/promote2.webp', 'images/sustain2.webp', 'images/promote3.webp'
  ];

  var ICON_PLAY  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF6EF"><polygon points="5,3 19,12 5,21"/></svg>';
  var ICON_HEART = '<svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF6EF"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  var ICON_IG    = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';

  function readCache() {
    try { return JSON.parse(localStorage.getItem(IG_CACHE_KEY)); } catch (e) { return null; }
  }

  function writeCache(posts) {
    try { localStorage.setItem(IG_CACHE_KEY, JSON.stringify({ t: Date.now(), posts: posts })); } catch (e) {}
  }

  // Keep only the fields we render, so the cache stays small
  function simplify(raw) {
    return raw.slice(0, 6).map(function (post) {
      return {
        img: post.sizes && post.sizes.medium ? post.sizes.medium.mediaUrl : post.thumbnailUrl || post.mediaUrl,
        link: post.permalink,
        caption: (post.prunedCaption || post.caption || '').substring(0, 80),
        video: post.mediaType === 'VIDEO'
      };
    }).filter(function (p) { return p.img && p.link; });
  }

  function tile(href, img, alt, icon) {
    var el = document.createElement('a');
    el.href = href;
    el.target = '_blank';
    el.rel = 'noopener';
    el.className = 'ig-post';
    el.style.cssText = 'display:block;text-decoration:none';
    el.innerHTML =
      '<img src="' + img + '" alt="' + alt.replace(/"/g, '') + '" loading="lazy">' +
      '<div class="ig-overlay"><span class="ig-likes">' + icon + '</span></div>';
    return el;
  }

  function renderPosts(posts) {
    grid.innerHTML = '';
    posts.forEach(function (p) {
      grid.appendChild(tile(p.link, p.img, p.caption, p.video ? ICON_PLAY : ICON_HEART));
    });
    status.textContent = '';
  }

  function renderFallback() {
    grid.innerHTML = '';
    IG_FALLBACK.forEach(function (src) {
      grid.appendChild(tile(IG_PROFILE, src, 'Crafts Council of India on Instagram', ICON_IG));
    });
    status.textContent = 'Follow @craftscouncilofindia on Instagram for our latest stories';
  }

  function loadFeed() {
    var cached = readCache();
    var age = cached && cached.t ? Date.now() - cached.t : Infinity;

    if (cached && cached.posts && cached.posts.length && age < IG_FRESH_MS) {
      renderPosts(cached.posts);
      return;
    }

    fetch(BEHOLD_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('Behold ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var posts = simplify(data.posts || data || []);
        if (!posts.length) throw new Error('No posts');
        writeCache(posts);
        renderPosts(posts);
      })
      .catch(function () {
        if (cached && cached.posts && cached.posts.length && age < IG_STALE_MS) {
          renderPosts(cached.posts);
        } else {
          renderFallback();
        }
      });
  }

  if (grid && status) {
    if ('IntersectionObserver' in window) {
      var igObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          igObserver.disconnect();
          loadFeed();
        }
      }, { rootMargin: '400px 0px' });
      igObserver.observe(grid);
    } else {
      loadFeed();
    }
  }

  /* ── SKELETON SHIMMER (injected once, shared across pages) ── */
  if (!document.getElementById('footer-js-styles')) {
    var style = document.createElement('style');
    style.id = 'footer-js-styles';
    style.textContent =
      '.ig-skeleton{background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:igShimmer 1.6s infinite}' +
      '@keyframes igShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}' +
      '.ig-post img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s}' +
      '.ig-post:hover img{transform:scale(1.05)}';
    document.head.appendChild(style);
}

/* ── GOOGLE ANALYTICS ───────────────────────── */

if(!window.gtag){

var gaScript=document.createElement('script');

gaScript.async=true;

gaScript.src='https://www.googletagmanager.com/gtag/js?id=G-MPHGJB3T4E';

document.head.appendChild(gaScript);

window.dataLayer=window.dataLayer||[];

window.gtag=function(){
dataLayer.push(arguments);
};

gtag('js',new Date());

gtag('config','G-MPHGJB3T4E');

}

/* ── ORGANIZATION SCHEMA ───────────────────── */

if(!document.getElementById('cci-schema')){

var schema=document.createElement('script');

schema.id='cci-schema';

schema.type='application/ld+json';

schema.text=JSON.stringify({

"@context":"https://schema.org",

"@type":"Organization",

"name":"Crafts Council of India",

"alternateName":"CCI",

"url":"https://www.craftscouncilofindia.in",

"logo":"https://www.craftscouncilofindia.in/images/logo.png",

"contactPoint":{
 "@type":"ContactPoint",
 "telephone":"+91-44-24341456",
 "contactType":"customer service",
 "areaServed":"IN",
 "availableLanguage":[
   "en",
   "hi",
   "ta"
 ]
},

"sameAs":[
 "https://facebook.com/craftscouncilofindia",
 "https://instagram.com/craftscouncilofindia",
 "https://www.youtube.com/@thecraftscouncilofindia6335",
 "https://linkedin.com/company/craftscouncilofindia"
]

});

document.head.appendChild(schema);

}

})();

