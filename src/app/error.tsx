"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rust">
          A small detour
        </p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl">
          This page could not load.
        </h1>
        <p className="mt-4 text-ink/65">
          Try once more. If the road is still blocked, come back in a little while.
        </p>
        <button className="button-primary mt-7" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
