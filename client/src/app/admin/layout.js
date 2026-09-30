import RequireAuth from "@/components/auth/RequireAuth";
import AdminShell from "@/components/admin/AdminShell";
import { STAFF_ROLES } from "@/context/AuthContext";

export const metadata = {
  title: { default: "Admin panel", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <RequireAuth role={STAFF_ROLES}>
      <AdminShell>{children}</AdminShell>
    </RequireAuth>
  );
}
