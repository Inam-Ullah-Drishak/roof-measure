"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, homeFor } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Button";

// Shows children only to logged-in users with the right role.
// role: "admin" or a list like ["admin", "employee"].
// (The API also checks every request; this just keeps the UI in sync.)
export default function RequireAuth({ role, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const roleOk = !role || [role].flat().includes(user?.role);
  const allowed = user && roleOk;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Cookie missing or expired
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!roleOk) {
      router.replace(homeFor(user));
    }
  }, [loading, user, roleOk, router, pathname]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-brand-600">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return children;
}
