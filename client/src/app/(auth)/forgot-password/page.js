import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password",
  description: "Reset the password for your account.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Forgot your password?</h1>
      <p className="mt-2 text-slate-600">
        Enter the email you signed up with and we&apos;ll send you a link to choose a new one.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
