"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import { useSearchParams } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { goToCheckout } from "@/lib/payments";
import {
  formatAddress,
  formatBytes,
  formatDate,
  formatMoney,
  reportTypeName,
  needsPayment,
} from "@/lib/format";

export default function OrderDetails({ id }) {
  const searchParams = useSearchParams();
  const { data, error, loading, reload } = useApi(`/orders/my/${id}`);
  const order = data?.order;

  const [actionError, setActionError] = useState("");
  const [paying, setPaying] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [verify, setVerify] = useState(null); // result of confirming a Stripe payment

  // Back from Stripe: confirm the payment right away (in case the webhook is slower)
  const paymentParam = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");
  useEffect(() => {
    if (paymentParam !== "success" || !sessionId) return;
    let cancelled = false;
    api(`/payments/verify/${encodeURIComponent(sessionId)}`)
      .then((result) => {
        if (cancelled) return;
        setVerify(result);
        reload();
      })
      .catch((err) => !cancelled && setVerify({ error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [paymentParam, sessionId, reload]);

  const onPay = async () => {
    setActionError("");
    setPaying(true);
    try {
      await goToCheckout(id);
    } catch (err) {
      setActionError(err.message);
      setPaying(false);
    }
  };

  const onCancel = async () => {
    if (!window.confirm(`Cancel order ${order.orderNumber}? This can't be undone.`)) return;
    setActionError("");
    setCancelling(true);
    try {
      await api(`/orders/my/${id}/cancel`, { method: "PATCH" });
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading && !order) {
    return <div className="flex justify-center py-24 text-brand-600"><Spinner className="h-8 w-8" /></div>;
  }

  if (error || !order) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-2 text-slate-600">
          {error?.status === 0 ? error.message : "This order doesn't exist or isn't linked to your account."}
        </p>
        <Button href="/dashboard/orders" variant="outline" className="mt-6">Back to my orders</Button>
      </div>
    );
  }

  const canPay = needsPayment(order);
  const canCancel = order.status === "pending" && order.payment.status !== "paid";
  const isPaid = order.payment.status === "paid";

  return (
    <>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${formatDate(order.createdAt, { time: true })}`}
        actions={
          <>
            {canCancel && (
              <Button variant="outline" onClick={onCancel} loading={cancelling}>Cancel order</Button>
            )}
            {canPay && (
              <Button variant="accent" onClick={onPay} loading={paying}>
                Pay {formatMoney(order.price, order.currency)}
              </Button>
            )}
          </>
        }
      >
        <BackButton href="/dashboard/orders" alwaysLink={Boolean(paymentParam)}>Back to my orders</BackButton>
      </PageHeader>

      <PaymentNotice
        param={paymentParam}
        message={searchParams.get("message")}
        verify={verify}
        isPaid={isPaid}
      />
      <Alert type="error" className="mb-6">{actionError}</Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Progress" actions={<OrderStatusBadge status={order.status} />}>
            <Timeline order={order} />
          </Card>

          <Card title="Report files">
            <ReportFiles order={order} isPaid={isPaid} canPay={canPay} onPay={onPay} paying={paying} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Property">
            <p className="font-medium text-slate-900">{order.property.street}</p>
            <p className="text-slate-600">
              {order.property.city}, {order.property.state} {order.property.zipCode}
            </p>
            <p className="mt-2 text-sm capitalize text-slate-500">{order.propertyType}</p>
          </Card>

          <Card title="Order details">
            <dl className="space-y-3 text-sm">
              <Row label="Report">{reportTypeName(order.reportType)}</Row>
              <Row label="Formats">{order.deliveryFormats.map((f) => f.toUpperCase()).join(", ")}</Row>
              <Row label="Turnaround"><span className="capitalize">{order.turnaround}</span></Row>
              <Row label="Detached structures">{order.includeDetachedStructures ? "Included" : "No"}</Row>
              {order.claimNumber && <Row label="Claim number">{order.claimNumber}</Row>}
              {order.referenceNumber && <Row label="Reference">{order.referenceNumber}</Row>}
            </dl>
            {order.specialInstructions && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-sm font-medium text-slate-800">Special instructions</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{order.specialInstructions}</p>
              </div>
            )}
          </Card>

          <Card title="Payment" actions={<PaymentStatusBadge status={order.payment.status} />}>
            <dl className="space-y-3 text-sm">
              <Row label="Total"><span className="font-semibold">{formatMoney(order.price, order.currency)}</span></Row>
              {order.payment.paidAt && <Row label="Paid on">{formatDate(order.payment.paidAt, { time: true })}</Row>}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}

function PaymentNotice({ param, message, verify, isPaid }) {
  if (param === "success") {
    if (isPaid) return <Alert type="success" className="mb-6">Payment received, thank you! We&apos;ve started working on your report and will email you when it&apos;s ready.</Alert>;
    if (verify?.error) return <Alert type="error" className="mb-6">We couldn&apos;t confirm your payment yet: {verify.error}. If you were charged, it will update shortly.</Alert>;
    if (verify) return <Alert type="info" className="mb-6">Your payment is being processed. This page will show &quot;Paid&quot; once it&apos;s confirmed.</Alert>;
    return <Alert type="info" className="mb-6">Confirming your payment…</Alert>;
  }
  if (param === "cancelled" && !isPaid) {
    return <Alert type="info" className="mb-6">Payment was cancelled. Your order is saved, so you can pay whenever you&apos;re ready.</Alert>;
  }
  if (param === "error" && !isPaid) {
    return <Alert type="error" className="mb-6">Your order was saved, but we couldn&apos;t open the payment page{message ? `: ${message}` : ""}. Please try &quot;Pay&quot; again.</Alert>;
  }
  return null;
}

function Timeline({ order }) {
  if (order.status === "cancelled") {
    return (
      <p className="text-sm text-slate-600">
        This order was cancelled on {formatDate(order.cancelledAt || order.updatedAt)}.
      </p>
    );
  }

  const startedAt = order.statusHistory?.find((h) => h.status === "in_progress")?.changedAt;
  const steps = [
    { label: "Order placed", done: true, date: order.createdAt },
    { label: "Payment received", done: order.payment.status === "paid", date: order.payment.paidAt },
    { label: "Measuring your roof", done: ["in_progress", "completed"].includes(order.status), date: startedAt },
    { label: "Report ready", done: order.status === "completed", date: order.completedAt },
  ];
  const current = steps.findIndex((s) => !s.done);

  return (
    <ol className="space-y-5">
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex gap-4">
          {i < steps.length - 1 && (
            <span className={`absolute left-3.5 top-8 h-[calc(100%-0.25rem)] w-0.5 ${s.done ? "bg-brand-600" : "bg-slate-200"}`} aria-hidden="true" />
          )}
          <span
            className={`relative flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold ${
              s.done ? "bg-brand-600 text-white" : i === current ? "bg-white text-brand-700 ring-2 ring-brand-600" : "bg-slate-100 text-slate-400"
            }`}
          >
            {s.done ? "✓" : i + 1}
          </span>
          <div className="pt-0.5">
            <p className={`text-sm font-semibold ${s.done || i === current ? "text-slate-900" : "text-slate-400"}`}>{s.label}</p>
            {s.done && s.date && <p className="text-xs text-slate-500">{formatDate(s.date, { time: true })}</p>}
            {i === current && <p className="text-xs text-brand-700">{i === 1 ? "Waiting for payment" : "In progress"}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function ReportFiles({ order, isPaid, canPay, onPay, paying }) {
  const files = order.reportFiles || [];

  if (files.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        {order.status === "cancelled"
          ? "No files for this order."
          : "Your report files will appear here as soon as they're ready. We'll email you too."}
      </p>
    );
  }

  if (!isPaid) {
    return (
      <div className="text-sm text-slate-600">
        <p>Your report is ready ({files.length} file{files.length > 1 ? "s" : ""}). Complete your payment to download it.</p>
        {canPay && <Button variant="accent" className="mt-4" onClick={onPay} loading={paying}>Pay and download</Button>}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {files.map((f) => (
        <li key={f._id} className="flex items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-brand-50 text-xs font-bold uppercase text-brand-700">
              {f.format === "other" ? "FILE" : f.format}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{f.fileName}</p>
              <p className="text-xs text-slate-500">{formatBytes(f.size)} · {formatDate(f.uploadedAt)}</p>
            </div>
          </div>
          {/* Plain link: the browser downloads it with the login cookie */}
          <a
            href={`/api/orders/${order._id}/files/${f._id}/download`}
            className="flex-none rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Download
          </a>
        </li>
      ))}
    </ul>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-900">{children}</dd>
    </div>
  );
}
