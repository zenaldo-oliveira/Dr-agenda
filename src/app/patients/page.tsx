import { PageContainer } from "@/components/ui/page-container";
import { AddPatientButton } from "./_components/add-patient-button";
import { PatientCard } from "./_components/patient-card";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function PatientsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.clinic) {
    redirect("/clinics-form");
  }

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
    orderBy: (patients, { desc }) => [desc(patients.createdAt)],
  });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <AddPatientButton clinicId={session.user.clinic.id} />
      </div>

      <div className="mt-8">
        {patients.length === 0 ? (
          <p className="text-muted-foreground">Nenhum paciente cadastrado.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
