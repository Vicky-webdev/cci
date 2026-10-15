import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");
  return (
    <main className="a-login">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
        <img src="/images/cci-logo.png" alt="Crafts Council of India" style={{ width: 90 }} />
        <h1 style={{ marginTop: 10 }}>Website administration</h1>
        <p className="a-muted a-small">Accounts are created by an administrator. There is no public sign-up.</p>
      </div>
      <LoginForm />
    </main>
  );
}
