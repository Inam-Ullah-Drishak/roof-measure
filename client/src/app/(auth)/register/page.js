import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create account",
  description: "Create a free account to order aerial roof measurement reports online.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Create your free account</h1>
      <p className="mt-2 text-slate-600">Order roof reports online. No subscription, pay per report.</p>
      <div className="mt-8">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </>
  );
}
