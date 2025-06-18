"use server";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { actionClient } from "@/lib/next-safe-action";
import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    try {
      if (parsedInput.id) {
        await db
          .update(patientsTable)
          .set({
            name: parsedInput.name,
            email: parsedInput.email,
            phoneNumber: parsedInput.phoneNumber,
            sex: parsedInput.sex,
            updatedAt: new Date(),
          })
          .where(eq(patientsTable.id, parsedInput.id));
      } else {
        await db.insert(patientsTable).values({
          name: parsedInput.name,
          email: parsedInput.email,
          phoneNumber: parsedInput.phoneNumber,
          sex: parsedInput.sex,
          clinicId: parsedInput.clinicId,
        });
      }

      revalidatePath("/patients");
      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro ao salvar paciente" };
    }
  });
