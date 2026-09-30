import NewOrderForm from "@/components/dashboard/NewOrderForm";
import { pricing } from "@/config/site";

export const metadata = { title: "New order" };

// Options can be pre-selected from a link, e.g. from the pricing calculator:
// /dashboard/orders/new?reportType=premium&turnaround=rush&detached=1&formats=pdf,esx
export default async function NewOrderPage({ searchParams }) {
  const sp = await searchParams;
  const defaults = {};

  if (pricing.reportTypes.some((r) => r.id === sp.reportType)) defaults.reportType = sp.reportType;
  if (sp.turnaround === "rush") defaults.turnaround = "rush";
  if (sp.detached === "1") defaults.includeDetachedStructures = true;
  if (typeof sp.formats === "string") {
    const valid = sp.formats.split(",").filter((f) => pricing.formats.some((p) => p.id === f));
    defaults.deliveryFormats = ["pdf", ...new Set(valid.filter((f) => f !== "pdf"))];
  }

  return <NewOrderForm defaults={defaults} />;
}
