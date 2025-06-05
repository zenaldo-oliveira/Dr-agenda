"use server";

import { db } from "@/db";
import { actionClient } from "@/lib/next-safe-action";
import type { InferInsertModel } from "drizzle-orm";
import { upsertDoctorSchema } from "./schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { doctorsTable } from "@/db/schema";

type DoctorInsert = InferInsertModel<typeof doctorsTable>;

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");
    if (!session.user.clinic?.id) throw new Error("Clinic not found");

    console.log("parsedInput:", parsedInput);
    console.log("clinicId:", session.user.clinic.id);

    const doctorToInsert: DoctorInsert = {
      id: parsedInput.id ?? undefined,
      clinicId: session.user.clinic.id,
      name: parsedInput.name,
      speciality: parsedInput.specialty,
      appointmentPriceInCents: parsedInput.appointmentPriceInCents,
      availableFromWeekdays: parsedInput.availableFromWeekDay.toString(),
      availableToWeekday: parsedInput.availableToWeekDay,
      availableFromTime: parsedInput.availableFromTime,
      availableToTime: parsedInput.availableToTime,
      avatar: (parsedInput as any).avatar ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db
      .insert(doctorsTable)
      .values(doctorToInsert)
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: doctorToInsert,
      });
  });
