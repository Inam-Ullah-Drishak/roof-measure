import RequireAuth from "@/components/auth/RequireAuth";
import AccountPlaceholder from "@/components/auth/AccountPlaceholder";

export const metadata = { title: "My dashboard", robots: { index: false } };

export default function DashboardPage() {
  return (
    <RequireAuth role="customer">
      <AccountPlaceholder title="My dashboard" />
    </RequireAuth>
  );
}
