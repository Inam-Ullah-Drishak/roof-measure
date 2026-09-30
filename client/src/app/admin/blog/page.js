import { Suspense } from "react";
import AdminPosts from "@/components/admin/AdminPosts";

export const metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return (
    <Suspense>
      <AdminPosts />
    </Suspense>
  );
}
