import { Suspense } from "react";
import AdminCustomers from "@/components/admin/AdminCustomers";

export const metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  return (
    <Suspense>
      <AdminCustomers />
    </Suspense>
  );
}
