import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }) {
  const { id } = await params;
  return <PostEditor id={id} />;
}
