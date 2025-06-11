"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { medicalSpecialties } from "../_constants";
import z from "zod";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertDoctor } from "@/actions/upsert-doctor";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Nome é obrigatorio.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPrice: z.number().min(1, {
      message: "Preço da consulta é obrigatório.",
    }),

    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora do término é obrigatória.",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de unicio não pode ser anterio ao horário de término ",
      path: ["availableToTime"],
    },
  );

interface UpsertDoctorFormProps {
  onSuccess?: () => void;
}

const UpsertDoctorForm = ({ onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentPrice: 0,
      availableFromWeekDay: "1",
      availableToWeekDay: "5",
      availableFromTime: "",
      availableToTime: "",
    },
  });

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico adicionado com sucesso.");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error ao adicionar médico.");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const addSeconds = (time: string) => {
      // Se o horário estiver no formato "HH:mm" (5 caracteres), adiciona ":00"
      return time.length === 5 ? time + ":00" : time;
    };

    upsertDoctorAction.execute({
      ...values,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      availableFromTime: addSeconds(values.availableFromTime),
      availableToTime: addSeconds(values.availableToTime),
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar médico</DialogTitle>
        <DialogDescription>Adicione um novo médico.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    thousandSeparator="."
                    allowNegative={false}
                    allowLeadingZeros={false}
                    customInput={Input}
                    prefix="R$ "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromWeekDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">🌞 Domingo</SelectItem>
                    <SelectItem value="1">📅 Segunda</SelectItem>
                    <SelectItem value="2">🗓️ Terça</SelectItem>
                    <SelectItem value="3">📆 Quarta</SelectItem>
                    <SelectItem value="4">📌 Quinta</SelectItem>
                    <SelectItem value="5">📁 Sexta</SelectItem>
                    <SelectItem value="6">🎉 Sábado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToWeekDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia final de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">🌞 Domingo</SelectItem>
                    <SelectItem value="1">📅 Segunda</SelectItem>
                    <SelectItem value="2">🗓️ Terça</SelectItem>
                    <SelectItem value="3">📆 Quarta</SelectItem>
                    <SelectItem value="4">📌 Quinta</SelectItem>
                    <SelectItem value="5">📁 Sexta</SelectItem>
                    <SelectItem value="6">🎉 Sábado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário de inicio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Grupo Cedo 🌅 */}
                    <SelectGroup>
                      <SelectLabel>Cedo 🌅</SelectLabel>
                      <SelectItem value="05:00">🕔 05:00</SelectItem>
                      <SelectItem value="05:30">🕠 05:30</SelectItem>
                      <SelectItem value="06:00">🕕 06:00</SelectItem>
                      <SelectItem value="06:30">🕡 06:30</SelectItem>
                      <SelectItem value="07:00">🕖 07:00</SelectItem>
                      <SelectItem value="07:30">🕢 07:30</SelectItem>
                      <SelectItem value="08:00">🕗 08:00</SelectItem>
                      <SelectItem value="08:30">🕣 08:30</SelectItem>
                    </SelectGroup>

                    {/* Grupo Tarde 🌞 */}
                    <SelectGroup>
                      <SelectLabel>Tarde 🌞</SelectLabel>
                      <SelectItem value="12:00">🕛 12:00</SelectItem>
                      <SelectItem value="12:30">🕧 12:30</SelectItem>
                      <SelectItem value="13:00">🕐 13:00</SelectItem>
                      <SelectItem value="13:30">🕜 13:30</SelectItem>
                      <SelectItem value="14:00">🕑 14:00</SelectItem>
                      <SelectItem value="14:30">🕝 14:30</SelectItem>
                      <SelectItem value="15:00">🕒 15:00</SelectItem>
                      <SelectItem value="15:30">🕞 15:30</SelectItem>
                    </SelectGroup>

                    {/* Grupo Noite 🌙 */}
                    <SelectGroup>
                      <SelectLabel>Noite 🌙</SelectLabel>
                      <SelectItem value="18:00">🕕 18:00</SelectItem>
                      <SelectItem value="18:30">🕡 18:30</SelectItem>
                      <SelectItem value="19:00">🕖 19:00</SelectItem>
                      <SelectItem value="19:30">🕢 19:30</SelectItem>
                      <SelectItem value="20:00">🕗 20:00</SelectItem>
                      <SelectItem value="20:30">🕣 20:30</SelectItem>
                      <SelectItem value="21:00">🕘 21:00</SelectItem>
                      <SelectItem value="21:30">🕤 21:30</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário final de disponibilidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Grupo Cedo 🌅 */}
                    <SelectGroup>
                      <SelectLabel>Cedo 🌅</SelectLabel>
                      <SelectItem value="05:00">🕔 05:00</SelectItem>
                      <SelectItem value="05:30">🕠 05:30</SelectItem>
                      <SelectItem value="06:00">🕕 06:00</SelectItem>
                      <SelectItem value="06:30">🕡 06:30</SelectItem>
                      <SelectItem value="07:00">🕖 07:00</SelectItem>
                      <SelectItem value="07:30">🕢 07:30</SelectItem>
                      <SelectItem value="08:00">🕗 08:00</SelectItem>
                      <SelectItem value="08:30">🕣 08:30</SelectItem>
                    </SelectGroup>

                    {/* Grupo Tarde 🌞 */}
                    <SelectGroup>
                      <SelectLabel>Tarde 🌞</SelectLabel>
                      <SelectItem value="12:00">🕛 12:00</SelectItem>
                      <SelectItem value="12:30">🕧 12:30</SelectItem>
                      <SelectItem value="13:00">🕐 13:00</SelectItem>
                      <SelectItem value="13:30">🕜 13:30</SelectItem>
                      <SelectItem value="14:00">🕑 14:00</SelectItem>
                      <SelectItem value="14:30">🕝 14:30</SelectItem>
                      <SelectItem value="15:00">🕒 15:00</SelectItem>
                      <SelectItem value="15:30">🕞 15:30</SelectItem>
                    </SelectGroup>

                    {/* Grupo Noite 🌙 */}
                    <SelectGroup>
                      <SelectLabel>Noite 🌙</SelectLabel>
                      <SelectItem value="18:00">🕕 18:00</SelectItem>
                      <SelectItem value="18:30">🕡 18:30</SelectItem>
                      <SelectItem value="19:00">🕖 19:00</SelectItem>
                      <SelectItem value="19:30">🕢 19:30</SelectItem>
                      <SelectItem value="20:00">🕗 20:00</SelectItem>
                      <SelectItem value="20:30">🕣 20:30</SelectItem>
                      <SelectItem value="21:00">🕘 21:00</SelectItem>
                      <SelectItem value="21:30">🕤 21:30</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={upsertDoctorAction.isPending}>
              {upsertDoctorAction.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
