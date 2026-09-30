import { Suspense } from "react";
import AdminEnquiries from "@/components/admin/AdminEnquiries";

export const metadata = { title: "Enquiries" };

export default function AdminEnquiriesPage() {
  return (
    <Suspense>
      <AdminEnquiries />
    </Suspense>
  );
}
