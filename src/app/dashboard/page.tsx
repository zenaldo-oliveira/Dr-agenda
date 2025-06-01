import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOutButton from "./components/sign-aut-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-md">
        <header>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </header>

        <section>
          <h2 className="text-xl font-semibold">
            Bem-vindo(a), {session.user.name}
          </h2>
          <p className="text-gray-500">{session.user.email}</p>
        </section>

        <footer>
          <SignOutButton />
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
