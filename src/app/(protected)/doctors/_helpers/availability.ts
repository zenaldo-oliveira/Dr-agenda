import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { doctorsTable } from "@/db/schema";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const from = dayjs
    .utc(`1970-01-01T${doctor.availableFromTime}Z`)
    .tz("America/Sao_Paulo");

  const to = dayjs
    .utc(`1970-01-01T${doctor.availableToTime}Z`)
    .tz("America/Cuiaba");

  return {
    from,
    to,
  };
};
