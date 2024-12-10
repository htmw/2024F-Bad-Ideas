"use client";

import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-2xl font-bold">
        WeatherWear
      </Link>
      <AuthForm mode="signin" />
      <p className="mt-4 text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
