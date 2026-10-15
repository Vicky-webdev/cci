"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="section" style={{ textAlign: "center", padding: "120px 20px" }}>
      <h1 className="s-title">Something went wrong</h1>
      <p style={{ margin: "16px 0 24px" }}>Please try again in a moment.</p>
      <button type="button" className="btn-primary" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
