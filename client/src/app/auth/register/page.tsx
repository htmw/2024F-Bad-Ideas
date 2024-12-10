"use client";

import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-2xl font-bold">
        WeatherWear
      </Link>
      <AuthForm mode="register" />
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
