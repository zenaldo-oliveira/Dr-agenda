"use server";
import { upsertDoctorSchema } from "./schema";
import { db } from "@/db";
import { actionClient } from "@/lib/next-safe-action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { doctorsTable } from "@/db/schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    const availableFromTime = parsedInput.availableFromTime;
    const availableToTime = parsedInput.availableToTime;

    // Validação dos horários
    if (!availableFromTime || !availableToTime) {
      throw new Error("Horários disponíveis ausentes");
    }

    if (
      !timeRegex.test(availableFromTime) ||
      !timeRegex.test(availableToTime)
    ) {
      throw new Error("Formato de horário inválido, esperado HH:mm:ss");
    }

    // Parse e conversão para UTC
    const availableFromTimeUTC = dayjs.utc(availableFromTime, "HH:mm:ss");
    const availableToTimeUTC = dayjs.utc(availableToTime, "HH:mm:ss");

    if (!availableFromTimeUTC.isValid() || !availableToTimeUTC.isValid()) {
      throw new Error("Horário inválido após parsing");
    }

    // Busca sessão do usuário
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");
    if (!session.user.clinic?.id) throw new Error("Clinic not found");

    // Inserção ou atualização no banco
    await db
      .insert(doctorsTable)
      .values({
        ...parsedInput,
        id: parsedInput.id,
        clinicId: session.user.clinic.id,
        availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
        availableToTime: availableToTimeUTC.format("HH:mm:ss"),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: {
          ...parsedInput,
          clinicId: session.user.clinic.id,
          availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
          availableToTime: availableToTimeUTC.format("HH:mm:ss"),
          updatedAt: new Date(),
        },
      });
  });

  