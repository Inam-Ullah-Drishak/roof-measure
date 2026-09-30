"use client";

import { usePathname } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { adminNav } from "@/config/dashboardNav";
import { useApi } from "@/lib/useApi";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  // Re-check the unread count when moving between pages
  const { data } = useApi(`/admin/enquiries?status=new&limit=1&_=${encodeURIComponent(pathname)}`);

  return (
    <DashboardShell nav={adminNav} label="Admin panel" badges={{ "/admin/enquiries": data?.newCount }}>
      {children}
    </DashboardShell>
  );
}
