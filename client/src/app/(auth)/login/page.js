import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log in",
  description: "Log in to order roof measurement reports and download your files.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-slate-600">Log in to order reports and track your orders.</p>
      <div className="mt-8">
        {/* The form reads ?next= from the URL, which needs a Suspense boundary */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
