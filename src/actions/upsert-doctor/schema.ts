import z from "zod";

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatorio.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPriceInCents: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),

    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora do término é obrigatória.",
    }),
  })
  .refine((data) => data.availableFromTime < data.availableToTime, {
    message: "O horário de início não pode ser anterior ao horário de término.",
    path: ["availableToTime"],
  });

export type upsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
