import { Suspense } from "react";
import AdminOrders from "@/components/admin/AdminOrders";

export const metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <AdminOrders />
    </Suspense>
  );
}
