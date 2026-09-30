"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

// TEMPORARY landing page after login, until the real dashboards are built.
export default function AccountPlaceholder({ title }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo />
          <Button variant="outline" size="sm" onClick={onLogout} loading={loggingOut}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-slate-600">
          Logged in as <strong>{user.name}</strong> ({user.email}) · role: {user.role}
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          This page will be built in a later step.
        </div>
      </main>
    </div>
  );
}
