import { Suspense } from "react";
import AdminSubscribers from "@/components/admin/AdminSubscribers";

export const metadata = { title: "Subscribers" };

export default function AdminSubscribersPage() {
  return (
    <Suspense>
      <AdminSubscribers />
    </Suspense>
  );
}
