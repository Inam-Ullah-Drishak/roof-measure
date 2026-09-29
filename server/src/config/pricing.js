// All prices in USD. Update these once the client confirms final pricing.
export const PRICING = {
  reportType: {
    standard: 25,
    premium: 40,
    commercial: 75,
  },
  addOns: {
    rush: 15, // faster turnaround
    detachedStructures: 10, // garage, shed, etc.
  },
  // Extra charge per delivery format (PDF is always included free)
  formats: {
    pdf: 0,
    esx: 10,
    xml: 5,
    dxf: 5,
  },
};

export const calculateOrderPrice = ({
  reportType = "standard",
  turnaround = "standard",
  includeDetachedStructures = false,
  deliveryFormats = ["pdf"],
}) => {
  const base = PRICING.reportType[reportType];
  if (base === undefined) {
    throw Object.assign(new Error("Invalid report type"), { statusCode: 400 });
  }

  const breakdown = [{ label: `${reportType} report`, amount: base }];

  if (turnaround === "rush") {
    breakdown.push({ label: "Rush turnaround", amount: PRICING.addOns.rush });
  }

  if (includeDetachedStructures) {
    breakdown.push({
      label: "Detached structures",
      amount: PRICING.addOns.detachedStructures,
    });
  }

  // Remove duplicates, e.g. ["esx", "esx"]
  const uniqueFormats = [...new Set(deliveryFormats)];

  for (const format of uniqueFormats) {
    const cost = PRICING.formats[format];
    if (cost === undefined) {
      throw Object.assign(new Error(`Invalid delivery format: ${format}`), {
        statusCode: 400,
      });
    }
    if (cost > 0) {
      breakdown.push({ label: `${format.toUpperCase()} file`, amount: cost });
    }
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return { total, breakdown, formats: uniqueFormats };
};