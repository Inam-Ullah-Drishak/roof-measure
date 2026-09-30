import { Suspense } from "react";
import AdminTeam from "@/components/admin/AdminTeam";

export const metadata = { title: "Team" };

export default function AdminTeamPage() {
  return (
    <Suspense>
      <AdminTeam />
    </Suspense>
  );
}
