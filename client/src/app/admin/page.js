import RequireAuth from "@/components/auth/RequireAuth";
import AccountPlaceholder from "@/components/auth/AccountPlaceholder";

export const metadata = { title: "Admin panel", robots: { index: false } };

export default function AdminPage() {
  return (
    <RequireAuth role="admin">
      <AccountPlaceholder title="Admin panel" />
    </RequireAuth>
  );
}
