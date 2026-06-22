import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-cream lg:grid-cols-2">
      <section className="hidden bg-olive p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <Link className="text-xl font-bold" href="/">
          nomichi
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-sand">
            The trip desk
          </p>
          <h1 className="mt-5 font-[var(--font-display)] text-6xl uppercase leading-none">
            The clear
            <br />
            next step,
            <br />
            every time.
          </h1>
          <p className="mt-6 max-w-md leading-7 text-cream/65">
            Leads, conversations, and trips in one calm place.
          </p>
        </div>
        <p className="text-sm text-cream/40">Travel that finds you.</p>
      </section>
      <section className="grid place-items-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            className="inline-flex items-center gap-2 text-sm text-ink/55 hover:text-rust"
            href="/"
          >
            <ArrowLeft size={16} />
            Back to trips
          </Link>
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.22em] text-rust">
            Team login
          </p>
          <h2 className="mt-3 text-4xl font-bold">Good to see you.</h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Sign in to see who needs a call and what happens next.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
