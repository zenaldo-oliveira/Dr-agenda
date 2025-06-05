import { z } from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),

    clinicId: z.string({
      required_error: "Clínica é obrigatória.",
    }),

    name: z.string().min(1, {
      message: "Nome é obrigatório.",
    }),

    avatarImageUrl: z.string().url().optional(),

    // no banco é TEXT, então pode ser string normal
    availableFromWeekdays: z.string().min(1, {
      message: "Dia de início é obrigatório.",
    }),

    availableToWeekday: z.number().min(0).max(6, {
      message: "Dia da semana final inválido.",
    }),

    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),

    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),

    speciality: z.string().min(1, {
      message: "Especialidade é obrigatória.",
    }),

    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),
  })
  .refine((data) => data.availableFromTime < data.availableToTime, {
    message: "Hora de início não pode ser maior ou igual à hora de término.",
    path: ["availableToTime"],
  });

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
