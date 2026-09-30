import { Suspense } from "react";
import OrderDetails from "@/components/dashboard/OrderDetails";

export const metadata = { title: "Order details" };

export default async function OrderDetailsPage({ params }) {
  const { id } = await params;

  return (
    <Suspense>
      <OrderDetails id={id} />
    </Suspense>
  );
}
