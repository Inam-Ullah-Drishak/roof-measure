import AdminCustomerDetails from "@/components/admin/AdminCustomerDetails";

export const metadata = { title: "Customer" };

export default async function AdminCustomerPage({ params }) {
  const { id } = await params;
  return <AdminCustomerDetails id={id} />;
}
