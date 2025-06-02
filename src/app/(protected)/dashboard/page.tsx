import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import SignOutButton from "./components/sign-aut-button";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersToClinicsTable } from "@/db/schema";
import SignOutButton from "../_components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }
  //Preciso pegar o nome da clinica do usuario
  const clinic = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });
  if (clinic.length === 0) {
    redirect("/clinic-form");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-md">
        <header>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </header>

        <section>
          {session.user.image && (
            <img
              src={session.user.image}
              alt={`${session.user.name} foto`}
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
            />
          )}
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
