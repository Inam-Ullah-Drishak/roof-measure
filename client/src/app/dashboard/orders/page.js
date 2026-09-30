import { Suspense } from "react";
import MyOrders from "@/components/dashboard/MyOrders";

export const metadata = { title: "My orders" };

export default function MyOrdersPage() {
  return (
    <Suspense>
      <MyOrders />
    </Suspense>
  );
}
