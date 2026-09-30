import RequireAuth from "@/components/auth/RequireAuth";

// Admins only: employees are sent back to their own dashboard
export default function AdminOnlyLayout({ children }) {
  return <RequireAuth role="admin">{children}</RequireAuth>;
}
