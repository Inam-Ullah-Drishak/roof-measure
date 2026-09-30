import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Choose a new password",
  // Never index pages with secret tokens in the URL
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return (
    <>
      <h1 className="text-3xl font-bold">Choose a new password</h1>
      <p className="mt-2 text-slate-600">
        After saving, you&apos;ll be logged in and signed out everywhere else.
      </p>
      <div className="mt-8">
        <ResetPasswordForm token={token} />
      </div>
    </>
  );
}
