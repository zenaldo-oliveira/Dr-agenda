import { db } from "@/db";
import { upsertDoctorSchema, UpsertDoctorSchema } from "./schema";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const upsertDoctor = async (data: UpsertDoctorSchema) => {
  upsertDoctorSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!session?.user.clinic?.id) {
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
