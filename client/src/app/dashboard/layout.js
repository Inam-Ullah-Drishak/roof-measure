import RequireAuth from "@/components/auth/RequireAuth";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: { default: "My dashboard", template: "%s | My dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <RequireAuth role="customer">
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
