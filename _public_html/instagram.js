// ── CCI Instagram Feed ─────────────────────────────────────────────────────
// Drop <div id="cci-instagram"></div> anywhere and include this script.
// Set window.CCI_IG_TOKEN = "YOUR_TOKEN" BEFORE this script, or pass it via
// data-token attribute on the container div.
// If no token is provided, a styled placeholder grid is shown automatically.

(function () {
  'use strict';

  const PLACEHOLDER_COUNT = 5;

  // Palette of warm craft-inspired gradients for placeholders
  const GRADIENTS = [
    'linear-gradient(135deg,#C4845C 0%,#7A3818 100%)',
    'linear-gradient(135deg,#C4A44A 0%,#8B6914 100%)',
    'linear-gradient(135deg,#A0522D 0%,#5C2410 100%)',
    'linear-gradient(135deg,#8B7355 0%,#4A3728 100%)',
    'linear-gradient(135deg,#C4724A 0%,#8B3A1E 100%)',
    'linear-gradient(135deg,#D4956A 0%,#A0522D 100%)',
    'linear-gradient(135deg,#B8860B 0%,#6B4C11 100%)',
    'linear-gradient(135deg,#CD853F 0%,#8B4513 100%)',
    'linear-gradient(135deg,#D2691E 0%,#8B3A1E 100%)',
  ];

  const PLACEHOLDER_LABELS = [
    'Kanchipuram Silk','Block Printing','Dhokra Metal','Tanjore Painting',
    'Kutch Embroidery','Kalamkari','Natural Dyes','Wood Carving','Blue Pottery',
  ];

  function injectStyles() {
    if (document.getElementById('cci-ig-styles')) return;
    const style = document.createElement('style');
    style.id = 'cci-ig-styles';
    style.textContent = `
      .cci-ig-section {
        padding: 72px 48px;
        background: var(--linen, #FAF6EF);
      }
      .cci-ig-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 36px;
        flex-wrap: wrap;
        gap: 16px;
      }
      .cci-ig-heading-group {}
      .cci-ig-eyebrow {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: var(--cr, #8B3A1E);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cci-ig-eyebrow svg { flex-shrink: 0; }
      .cci-ig-title {
        font-family: 'Cormorant Garamond', serif;
        font-size: 36px;
        font-weight: 500;
        color: var(--ink, #1E1410);
        line-height: 1.1;
      }
      .cci-ig-follow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 22px;
        border: 1.5px solid var(--cr, #8B3A1E);
        border-radius: 3px;
        color: var(--cr, #8B3A1E);
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        text-decoration: none;
        transition: 0.25s;
        white-space: nowrap;
      }
      .cci-ig-follow:hover {
        background: var(--cr, #8B3A1E);
        color: #FAF6EF;
      }
      .cci-ig-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
      }
      .cci-ig-item {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: 4px;
        cursor: pointer;
        background: #e8ddd4;
      }
      .cci-ig-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }
      .cci-ig-item:hover img { transform: scale(1.06); }
      .cci-ig-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(30,20,16,0.7) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.3s;
        display: flex;
        align-items: flex-end;
        padding: 16px;
      }
      .cci-ig-item:hover .cci-ig-overlay { opacity: 1; }
      .cci-ig-overlay-text {
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        color: rgba(250,246,239,0.9);
        line-height: 1.4;
      }
      /* Placeholder tiles */
      .cci-ig-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;
      }
      .cci-ig-placeholder-label {
        font-family: 'DM Sans', sans-serif;
        font-size: 11px;
        color: rgba(250,246,239,0.6);
        letter-spacing: 0.5px;
        text-align: center;
        padding: 0 8px;
      }
      .cci-ig-token-notice {
        text-align: center;
        margin-top: 20px;
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        color: var(--mud, #7A6050);
        background: var(--cr-pale, #F2E8E0);
        padding: 12px 20px;
        border-radius: 4px;
        max-width: 560px;
        margin-left: auto;
        margin-right: auto;
      }
      .cci-ig-token-notice code {
        background: rgba(139,58,30,0.1);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
      }
      .cci-ig-loading {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        font-family: 'DM Sans', sans-serif;
        font-size: 13px;
        color: var(--mud, #7A6050);
      }
      @media (max-width: 768px) {
        .cci-ig-section { padding: 48px 20px; }
        .cci-ig-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .cci-ig-title { font-size: 28px; }
      }
      @media (max-width: 480px) {
        .cci-ig-grid { grid-template-columns: repeat(3, 1fr); }
      }
    `;
    document.head.appendChild(style);
  }

  function renderPlaceholders(container, notice) {
    const grid = container.querySelector('.cci-ig-grid');
    grid.innerHTML = '';
    for (let i = 0; i < PLACEHOLDER_COUNT; i++) {
      const item = document.createElement('div');
      item.className = 'cci-ig-item';
      item.innerHTML = `
        <div class="cci-ig-placeholder" style="background:${GRADIENTS[i % GRADIENTS.length]}">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(250,246,239,0.4)" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span class="cci-ig-placeholder-label">${PLACEHOLDER_LABELS[i % PLACEHOLDER_LABELS.length]}</span>
        </div>
        <div class="cci-ig-overlay"><div class="cci-ig-overlay-text">${PLACEHOLDER_LABELS[i % PLACEHOLDER_LABELS.length]}</div></div>
      `;
      grid.appendChild(item);
    }
    if (notice) {
      const msg = document.createElement('p');
      msg.className = 'cci-ig-token-notice';
      msg.innerHTML = `<strong>Instagram feed placeholder</strong> — Add your access token via <code>window.CCI_IG_TOKEN = "..."</code> before this script to load real posts.`;
      container.appendChild(msg);
    }
  }

  async function loadInstagramPosts(token, grid) {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=5&access_token=${token}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('API error ' + res.status);
      const data = await res.json();
      if (!data.data || !data.data.length) throw new Error('No posts');

      grid.innerHTML = '';
      data.data.slice(0, 5).forEach(function (post) {
        const src = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
        const caption = (post.caption || '').slice(0, 80);
        const item = document.createElement('a');
        item.className = 'cci-ig-item';
        item.href = post.permalink;
        item.target = '_blank';
        item.rel = 'noopener';
        item.innerHTML = `
          <img src="${src}" alt="${caption}" loading="lazy">
          <div class="cci-ig-overlay"><div class="cci-ig-overlay-text">${caption}</div></div>
        `;
        grid.appendChild(item);
      });
    } catch (err) {
      console.warn('CCI Instagram feed:', err.message);
      renderPlaceholders(grid.closest('.cci-ig-section') || grid.parentElement, true);
    }
  }

  function initFeed(host) {
    injectStyles();
    const token = window.CCI_IG_TOKEN || host.dataset.token || null;
    const handle = host.dataset.handle || 'craftscouncilofindia';

    host.innerHTML = `
      <div class="cci-ig-section">
        <div class="cci-ig-header">
          <div class="cci-ig-heading-group">
            <div class="cci-ig-eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Follow our journey
            </div>
            <h2 class="cci-ig-title">From Our Instagram</h2>
          </div>
          <a href="https://instagram.com/${handle}" target="_blank" rel="noopener" class="cci-ig-follow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            @${handle}
          </a>
        </div>
        <div class="cci-ig-grid">
          <div class="cci-ig-loading">Loading posts…</div>
        </div>
      </div>
    `;

    const section = host.querySelector('.cci-ig-section');
    const grid = host.querySelector('.cci-ig-grid');

    if (token) {
      loadInstagramPosts(token, grid);
    } else {
      renderPlaceholders(section, true);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('#cci-instagram, .cci-instagram').forEach(initFeed);
  });

  // Also expose for manual init
  window.CCIInstagram = { init: initFeed };
})();
