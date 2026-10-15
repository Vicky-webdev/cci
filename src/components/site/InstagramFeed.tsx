"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Behold.so Instagram feed (legacy footer.js behaviour):
 *  - only fetched when the grid scrolls near the viewport;
 *  - cached in localStorage for 6 h; a cache up to 3 days old is used if Behold fails;
 *  - otherwise a static grid of site photos linking to the Instagram profile.
 */
const CACHE_KEY = "cci_ig_feed_v1";
const FRESH_MS = 6 * 60 * 60 * 1000;
const STALE_MS = 3 * 24 * 60 * 60 * 1000;

interface Post {
  img: string;
  link: string;
  caption: string;
  video: boolean;
}

interface BeholdPost {
  sizes?: { medium?: { mediaUrl?: string } };
  thumbnailUrl?: string;
  mediaUrl?: string;
  permalink?: string;
  prunedCaption?: string;
  caption?: string;
  mediaType?: string;
}

function readCache(): { t: number; posts: Post[] } | null {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
  } catch {
    return null;
  }
}

function simplify(raw: BeholdPost[]): Post[] {
  return raw
    .slice(0, 6)
    .map((p) => ({
      img: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl ?? "",
      link: p.permalink ?? "",
      caption: (p.prunedCaption ?? p.caption ?? "").substring(0, 80),
      video: p.mediaType === "VIDEO",
    }))
    .filter((p) => p.img && p.link);
}

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF6EF" aria-hidden="true">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FAF6EF" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FAF6EF" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function InstagramFeed({
  feedUrl,
  profileUrl,
  handle,
  fallbackImages,
}: {
  feedUrl: string;
  profileUrl: string;
  handle: string;
  fallbackImages: string[];
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ kind: "loading" } | { kind: "posts"; posts: Post[] } | { kind: "fallback" }>({ kind: "loading" });

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    let cancelled = false;
    const load = () => {
      const cached = readCache();
      const age = cached?.t ? Date.now() - cached.t : Infinity;
      if (cached?.posts?.length && age < FRESH_MS) return setState({ kind: "posts", posts: cached.posts });
      if (!feedUrl) return setState({ kind: "fallback" });
      fetch(feedUrl)
        .then((r) => {
          if (!r.ok) throw new Error(`Behold ${r.status}`);
          return r.json();
        })
        .then((data: { posts?: BeholdPost[] } | BeholdPost[]) => {
          const posts = simplify(Array.isArray(data) ? data : (data.posts ?? []));
          if (!posts.length) throw new Error("No posts");
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), posts }));
          } catch {
            /* storage unavailable */
          }
          if (!cancelled) setState({ kind: "posts", posts });
        })
        .catch(() => {
          if (cancelled) return;
          if (cached?.posts?.length && age < STALE_MS) setState({ kind: "posts", posts: cached.posts });
          else setState({ kind: "fallback" });
        });
    };
    if (!("IntersectionObserver" in window)) {
      load();
      return () => void (cancelled = true);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          load();
        }
      },
      { rootMargin: "400px 0px" },
    );
    obs.observe(el);
    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, [feedUrl]);

  const tile = (key: string, href: string, img: string, alt: string, icon: React.ReactNode) => (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="ig-post" style={{ display: "block", textDecoration: "none" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- remote Instagram CDN images */}
      <img src={img} alt={alt.replace(/"/g, "")} loading="lazy" />
      <div className="ig-overlay">
        <span className="ig-likes">{icon}</span>
      </div>
    </a>
  );

  return (
    <>
      <div id="footer-ig-grid" className="insta-grid" ref={gridRef}>
        {state.kind === "loading" && Array.from({ length: 6 }, (_, i) => <div key={i} className="ig-post ig-skeleton" />)}
        {state.kind === "posts" &&
          state.posts.map((p, i) => tile(`p${i}`, p.link, p.img, p.caption, p.video ? <PlayIcon /> : <HeartIcon />))}
        {state.kind === "fallback" &&
          fallbackImages.map((src, i) => tile(`f${i}`, profileUrl, src, "Crafts Council of India on Instagram", <IgIcon />))}
      </div>
      <p className="insta-note" id="footer-ig-status" aria-live="polite">
        {state.kind === "loading" ? "Loading latest posts..." : state.kind === "fallback" ? `Follow ${handle} on Instagram for our latest stories` : ""}
      </p>
    </>
  );
}
