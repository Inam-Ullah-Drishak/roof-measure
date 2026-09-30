"use client";

import { usePathname } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminNav, employeeNav } from "@/config/dashboardNav";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/useApi";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  // Re-check the unread count when moving between pages (admins only)
  const { data } = useApi(isAdmin ? `/admin/enquiries?status=new&limit=1&_=${encodeURIComponent(pathname)}` : null);

  return (
    <DashboardShell
      nav={isAdmin ? adminNav : employeeNav}
      label={isAdmin ? "Admin panel" : "Team panel"}
      badges={{ "/admin/enquiries": data?.newCount }}
    >
      {children}
    </DashboardShell>
  );
}
