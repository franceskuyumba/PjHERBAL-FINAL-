"use client";

import { useEffect, useState } from "react";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeHeader({ firstName }: { firstName: string }) {
  const [greet, setGreet] = useState("Welcome back");

  useEffect(() => {
    setGreet(greeting());
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-brand-950 sm:text-3xl">
        {greet}, {firstName} 👋
      </h1>
      <p className="mt-1 text-sm text-ink/55">
        Welcome back to your PJHERBAL Clinic wellness account. Here is your health at a glance.
      </p>
    </div>
  );
}
