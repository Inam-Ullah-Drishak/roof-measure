import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Choose a new password",
  // Never index pages with secret tokens in the URL
  robots: { index: false, follow: false },
};

// ?welcome=1 comes from a team invite email: same form, friendlier wording
export default async function ResetPasswordPage({ params, searchParams }) {
  const { token } = await params;
  const welcome = (await searchParams).welcome === "1";

  return (
    <>
      <h1 className="text-3xl font-bold">{welcome ? "Welcome to the team" : "Choose a new password"}</h1>
      <p className="mt-2 text-slate-600">
        {welcome
          ? "Set a password for your account. You'll be logged in straight after."
          : <>After saving, you&apos;ll be logged in and signed out everywhere else.</>}
      </p>
      <div className="mt-8">
        <ResetPasswordForm token={token} welcome={welcome} />
      </div>
    </>
  );
}
