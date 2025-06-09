import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
    availableFromWeekDay: z.number().min(0).max(6, {
      message: "Dia da semana (início) inválido.",
    }),
    availableToWeekDay: z.number().min(0).max(6, {
      message: "Dia da semana (término) inválido.",
    }),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
    avatarImageUrl: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      // Compara horário, não dia da semana
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "Hora de início deve ser antes da hora de término.",
      path: ["availableToTime"],
    },
  );

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
