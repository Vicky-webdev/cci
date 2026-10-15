/* ── CCI nav.js FINAL ───────────────────────────────────────────── */
(function () {
  'use strict';

  var navEl = document.getElementById('main-nav');
  var menuEl = document.getElementById('mobileMenu');

  /* =========================
     DESKTOP NAV
  ========================= */
  if (navEl) {
    navEl.innerHTML = `
      <a class="nav-logo" href="https://craftscouncilofindia.in">
        <img src="images/cci-logo.png" style="width:110px;" alt="CCI Logo">
       </a>

      <ul class="nav-center">
        <li class="nav-item"><a href="about.html">About</a>
                  <div class="dropdown">
            <a href="about.html#history">History</a>
            <a href="about.html#vision">Vision</a>
            <a href="about.html#mission">Mission</a>
            <a href="about.html#team">Team</a>
          </div>
          </li>

        <li class="nav-item">
          <a href="what-we-do.html">What we do</a>
          <div class="dropdown">
            <a href="what-we-do.html#support">Support</a>
            <a href="what-we-do.html#promote">Promote</a>
            <a href="what-we-do.html#sustain">Sustain</a>
          </div>
        </li>
<li class="nav-item"><a href="crafts-map.html">Crafts of India</a></li>
         <li class="nav-item"><a href="awards.html">Recognition</a></li>

        <li class="nav-item"><a href="events.html">Events</a></li>
        <li class="nav-item"><a href="news.html">News</a></li>

        <li class="nav-item">
          <a href="#">Resources</a>
          <div class="dropdown">
            <a href="books.html">Books</a>
            <a href="newsletters.html">Newsletters</a>
            <a href="happenings-in-handmade.html">Happenings in Handmade</a>
            <a href="reports.html">Reports</a>
            <a href="crafts-map.html">Indian Crafts Map</a>
          </div>
        </li>

        <li class="nav-item">
          <a href="#">Archive</a>
          <div class="dropdown">
            <a href="#">History gallery</a>
            <a href="press.html">Press</a>
            <a href="past-events.html">Past Events</a>
            <a href="past-awards.html">Past Awards</a>
            <a href="past-newsletters.html">Past Newsletters</a>
             <a href="past-happenings-in-handmade.html">Past Happenings in Handmade</a>
          </div>
        </li>

      
       </ul>
      <button class="nav-cta" onclick="window.location.href='contact.html'">
        Contact us
      </button>

      <button class="hamburger" id="hamburgerBtn" onclick="toggleMobileMenu()" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    `;
  }

  /* =========================
     MOBILE MENU
  ========================= */
  if (menuEl) {
    menuEl.innerHTML = `
      <div class="mobile-menu-item"><a href="about.html">About</a></div>
      <div class="mobile-menu-item">
        <span onclick="toggleSubMenu(this, event)">What we do</span>
        <div class="mobile-submenu">
          <a href="what-we-do.html#support">Support</a>
          <a href="what-we-do.html#promote">Promote</a>
          <a href="what-we-do.html#sustain">Sustain</a>
        </div>
      </div>
      <div class="mobile-menu-item"><a href="crafts-map.html">Crafts of India</a></div>
      <div class="mobile-menu-item"><a href="awards.html">Recognition</a></div>
      <div class="mobile-menu-item"><a href="events.html">Events</a></div>
      <div class="mobile-menu-item"><a href="news.html">News</a></div>
      <div class="mobile-menu-item">
        <span onclick="toggleSubMenu(this, event)">Resources</span>
        <div class="mobile-submenu">
          <a href="books.html">Books</a>
          <a href="newsletters.html">Newsletters</a>
           <a href="happenings-in-handmade.html">Happenings in Handmade</a>
          <a href="reports.html">Reports</a>
          <a href="crafts-map.html">Indian Crafts Map</a>
        </div>
      </div>

      <div class="mobile-menu-item">
        <span onclick="toggleSubMenu(this, event)">Archive</span>
        <div class="mobile-submenu">
          <a href="#">History gallery</a>
          <a href="press.html">Press</a>
          <a href="past-events.html">Past Events</a>
          <a href="past-newsletters.html">Past Newsletters</a>
          <a href="past-happenings-in-handmade.html">Past Happenings in Handmade</a>
        </div>
      </div>

      <div class="mobile-cta-item"><a href="contact.html">Contact us</a></div>
    `;
  }

  /* =========================
     TOGGLE MOBILE MENU
  ========================= */
  function toggleMobileMenu() {
    var menu = menuEl;
    var btn = document.getElementById('hamburgerBtn');
    if (!menu) return;

    var isOpen = menu.classList.toggle('active');
    if (btn) {
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
    }
  }
  window.toggleMobileMenu = toggleMobileMenu;

  /* =========================
     SUBMENU FIX
  ========================= */
  function toggleSubMenu(el, event) {
    event.stopPropagation();

    var parentItem = el.closest('.mobile-menu-item');
    var submenu = parentItem.querySelector('.mobile-submenu');

    if (!submenu) return;

    document.querySelectorAll('.mobile-submenu.open').forEach(function (menu) {
      if (menu !== submenu) {
        menu.classList.remove('open');
        if (menu.previousElementSibling) {
          menu.previousElementSibling.classList.remove('active');
        }
      }
    });

    submenu.classList.toggle('open');
    el.classList.toggle('active');
  }
  window.toggleSubMenu = toggleSubMenu;

  /* =========================
     CLOSE ON OUTSIDE CLICK
  ========================= */
  document.addEventListener('click', function (e) {
    var menu = menuEl;
    var btn = document.getElementById('hamburgerBtn');

    if (!menu || !menu.classList.contains('active')) return;

    if (menu.contains(e.target)) return;
    if (btn && btn.contains(e.target)) return;

    menu.classList.remove('active');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', false);
  });

})();


