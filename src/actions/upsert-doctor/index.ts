import { Input } from "@/components/ui/input";
import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { upsertDoctorSchema, UpsertDoctorSchema } from "./schema";
import { headers } from "next/headers";
import { PgTableWithColumns, PgColumn } from "drizzle-orm/pg-core";
import { auth } from "@/lib/auth";

export const upsertDoctor = async (data: UpsertDoctorSchema) => {
  upsertDoctorSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!session?.user.clinic) {
    throw new Error("Clinic not found");
  }

  await db
    .insert(doctorsTable)
    .values({
      id: data.id,
      clinicId: session?.user.clinic?.id,
      ...data,
    })
    .onConflictDoUpdate({
      target: [doctorsTable.id],
      set: {
        ...data,
      },
    });
};
