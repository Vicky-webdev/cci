"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function useAutoplay(total: number, delay: number) {
  const [cur, setCur] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const go = useCallback((n: number) => setCur(((n % total) + total) % total), [total]);
  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);
  const start = useCallback(() => {
    stop();
    if (total > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer.current = setInterval(() => setCur((c) => (c + 1) % total), delay);
    }
  }, [delay, stop, total]);
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);
  return { cur, go, start, stop };
}

/** Home hero slider (legacy index.html: translateX track, arrows, dots, 5 s autoplay). */
export function HeroSlider({ slides, intervalMs }: { slides: { image: string; alt: string }[]; intervalMs: number }) {
  const { cur, go, start } = useAutoplay(slides.length, intervalMs);
  const move = (n: number) => {
    go(n);
    start();
  };
  return (
    <div className="slider-container" aria-roledescription="carousel">
      <div className="slider-track" id="sliderTrack" style={{ transform: `translateX(-${cur * 100}%)` }}>
        {slides.map((sl, i) => (
          <div
            key={i}
            className="slide"
            role="img"
            aria-label={sl.alt || `Slide ${i + 1}`}
            aria-hidden={i !== cur}
            style={{ backgroundImage: `url("${sl.image}")`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="slide-content"></div>
          </div>
        ))}
      </div>
      <button type="button" className="slider-arrow prev" onClick={() => move(cur - 1)} aria-label="Previous slide">
        &#8249;
      </button>
      <button type="button" className="slider-arrow next" onClick={() => move(cur + 1)} aria-label="Next slide">
        &#8250;
      </button>
      <div className="slider-dots">
        {slides.map((_, i) => (
          <button type="button" key={i} className={`slider-dot${i === cur ? " active" : ""}`} onClick={() => move(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/** Kamala shop slider (legacy: translate3d, 4 s autoplay, pause on hover, swipe). */
export function RetailSlider({ slides, intervalMs }: { slides: { image: string; alt: string }[]; intervalMs: number }) {
  const { cur, go, start, stop } = useAutoplay(slides.length, intervalMs);
  const touchX = useRef(0);
  const move = (n: number) => {
    stop();
    go(n);
    start();
  };
  return (
    <div
      className="retail-image retail-slider"
      id="retailSlider"
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        stop();
      }}
      onTouchEnd={(e) => {
        const dx = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 40) go(dx > 0 ? cur + 1 : cur - 1);
        start();
      }}
    >
      <div className="retail-slider-track" style={{ transform: `translate3d(-${cur * 100}%,0,0)` }}>
        {slides.map((sl, i) => (
          <div className="retail-slide" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element -- legacy slider sizing depends on plain img */}
            <img src={sl.image} alt={sl.alt} />
          </div>
        ))}
      </div>
      <button type="button" className="rs-arrow rs-prev" onClick={() => move(cur - 1)} aria-label="Previous">
        &#8249;
      </button>
      <button type="button" className="rs-arrow rs-next" onClick={() => move(cur + 1)} aria-label="Next">
        &#8250;
      </button>
      <div className="rs-dots">
        {slides.map((_, i) => (
          <button type="button" key={i} className={`rs-dot${i === cur ? " active" : ""}`} onClick={() => move(i)} aria-label={`Show image ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/** What-we-do section slider (legacy: scrollLeft-based, per-section delay, swipe keeps dots in sync). */
export function SectionSlider({
  name,
  slides,
  intervalMs,
}: {
  name: string;
  slides: { image: string; alt: string; caption?: string }[];
  intervalMs: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { cur, go, start, stop } = useAutoplay(slides.length, intervalMs);
  useEffect(() => {
    const t = trackRef.current;
    if (t) t.scrollLeft = cur * t.clientWidth;
  }, [cur]);
  const move = (n: number) => {
    stop();
    go(n);
    start();
  };
  // Legacy markup hard-coded four dots whatever the slide count (2 or 8 slides); one dot per slide now.
  const dots = slides.length;
  return (
    <div className="wwd-slider" data-slider={name} onMouseEnter={stop} onMouseLeave={start}>
      <div
        className="wwd-slider-track"
        ref={trackRef}
        onScroll={(e) => {
          const t = e.currentTarget;
          const idx = Math.round(t.scrollLeft / t.clientWidth);
          if (idx !== cur) go(idx);
        }}
      >
        {slides.map((sl, i) => (
          <div className="wwd-slide" key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element -- legacy slider sizing depends on plain img */}
            <img src={sl.image} alt={sl.alt} />
            {sl.caption && <div className="wwd-slide-caption">{sl.caption}</div>}
          </div>
        ))}
      </div>
      <button type="button" className="wwd-sl-arrow wwd-sl-prev" aria-label="Previous" onClick={() => move(cur - 1)}>
        &#8249;
      </button>
      <button type="button" className="wwd-sl-arrow wwd-sl-next" aria-label="Next" onClick={() => move(cur + 1)}>
        &#8250;
      </button>
      <div className="wwd-sl-dots">
        {Array.from({ length: dots }, (_, i) => (
          <button type="button" key={i} className={`wwd-sl-dot${i === cur ? " active" : ""}`} onClick={() => move(i)} aria-label={`Show image ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/** Sticky in-page navigation with smooth scroll and active-section highlight (legacy what-we-do.html). */
export function AnchorBar({ links }: { links: { label: string; anchor: string }[] }) {
  const [active, setActive] = useState(links[0]?.anchor ?? "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-130px 0px -50% 0px", threshold: 0 },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.anchor);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [links]);
  return (
    <div className="anchor-bar">
      <div className="anchor-bar-inner">
        {links.map((l) => (
          <a
            key={l.anchor}
            className={`anchor-link${active === l.anchor ? " active" : ""}`}
            href={`#${l.anchor}`}
            onClick={(e) => {
              const target = document.getElementById(l.anchor);
              if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                history.replaceState(null, "", `#${l.anchor}`);
              }
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
