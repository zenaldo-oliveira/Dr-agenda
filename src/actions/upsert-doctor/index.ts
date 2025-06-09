"use server";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { UpsertDoctorSchema } from "./schema";
import { headers } from "next/headers";

export const UpsertDoctor = actionClient
  .schema(UpsertDoctorSchema)
  .action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const clinicId = session.user.clinic?.id;
    if (!clinicId) {
      throw new Error("Clinic not found");
    }

    const { id, ...rest } = data;

    await db
      .insert(doctorsTable)
      .values({
        ...rest,
        id, // para edição
        clinicId,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...rest,
          clinicId,
        },
      });
  });
