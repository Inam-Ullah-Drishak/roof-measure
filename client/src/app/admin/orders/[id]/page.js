import AdminOrderDetails from "@/components/admin/AdminOrderDetails";

export const metadata = { title: "Order details" };

export default async function AdminOrderPage({ params }) {
  const { id } = await params;
  return <AdminOrderDetails id={id} />;
}
