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
      message: "Dia da semana inicial deve estar entre 0 e 6.",
    }),

    availableToWeekDay: z.number().min(0).max(6, {
      message: "Dia da semana final deve estar entre 0 e 6.",
    }),

    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),

    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
  })
  .refine(
    (data) =>
      timeToMinutes(data.availableFromTime) <
      timeToMinutes(data.availableToTime),
    {
      message: "A hora de início deve ser menor que a hora de término.",
      path: ["availableFromTime"],
    }
  );;

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
function timeToMinutes(availableFromTime: string) {
  throw new Error("Function not implemented.");
}

