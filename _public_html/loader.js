(function () {
  var pathname = (window.location.pathname || '').toLowerCase();
  var pageName = pathname.split('/').pop() || 'index.html';

  function getScripts() {
    var scripts = ['nav.js', 'footer.js'];

    // Load events.js on index.html, root (/), and all event-related pages
    if (['index.html', '', 'events.html', 'event-detail.html', 'past-events.html'].includes(pageName)) {
      // PAST_EVENTS archive (large) — only needed by the archive listing and detail pages.
      // Loaded before events.js so getEventById() can resolve archive ids on first render.
      if (pageName === 'event-detail.html' || pageName === 'past-events.html') {
        scripts.push('events-final.js');
      }
      scripts.push('events.js');
    } else if (pageName === 'news.html' || pageName === 'news-detail.html') {
      scripts.push('news.js');
    } else if (pageName === 'press.html' || pageName === 'press-details.html') {
      scripts.push('press.js');
    }
    return scripts;
  }

  function loadScripts(files, index) {
    if (index >= files.length) {
      if (window.dispatchEvent) {
        window.dispatchEvent(new Event('site-scripts-ready'));
      }
      return;
    }
    var script = document.createElement('script');
    // Cache-bust with the version from config.js — bump APP_VERSION on every deploy
    // so browsers/Cloudflare fetch the new data files instead of a stale copy.
    script.src = files[index] + (window.APP_VERSION ? '?v=' + encodeURIComponent(window.APP_VERSION) : '');
    script.async = false;
    script.defer = false;
    script.onload = function () {
      loadScripts(files, index + 1);
    };
    script.onerror = function () {
      // Continue loading remaining scripts even if one fails
      loadScripts(files, index + 1);
    };
    
    // Safely append to document.body or head
    (document.body || document.head || document.documentElement).appendChild(script);
  }

  loadScripts(getScripts(), 0);
})();