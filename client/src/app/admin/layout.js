import RequireAuth from "@/components/auth/RequireAuth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: { default: "Admin panel", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <RequireAuth role="admin">
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
