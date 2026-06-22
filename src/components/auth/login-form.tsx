"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { login, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="label">Email</span>
        <input
          autoComplete="email"
          className="field"
          name="email"
          placeholder="you@thenomichi.com"
          type="email"
        />
      </label>
      <label className="block">
        <span className="label">Password</span>
        <input
          autoComplete="current-password"
          className="field"
          name="password"
          placeholder="Your password"
          type="password"
        />
      </label>
      {state.error ? (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <button className="button-primary w-full gap-2" disabled={pending}>
        <LogIn size={17} />
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
