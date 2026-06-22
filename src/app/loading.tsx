export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sand/40 border-t-rust" />
        <p className="mt-4 text-sm text-ink/60">Finding the road ahead.</p>
      </div>
    </main>
  );
}
