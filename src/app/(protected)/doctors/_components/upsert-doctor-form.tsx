"use client";

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { DialogContent } from "@/components/ui/dialog";
import { useAction } from "next-safe-action/hooks";
import { NumericFormat } from "react-number-format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { medicalSpecialties } from "../_constants";
import { upsertDoctor } from "@/actions/upsert-doctor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória",
    }),
    appointmentPrice: z.number().min(1, {
      message: "Preço da consulta é obrigatório",
    }),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término",
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
      toast.success("Médico atualizado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar médico");
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      availableFromWeekDay: parseInt(values.availableFromWeekDay),
      availableToWeekDay: parseInt(values.availableToWeekDay),
      appointmentPriceInCents: Math.round(values.appointmentPrice * 100),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Médico</DialogTitle>
        <DialogDescription>Adicionar um novo médico</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
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
                    onValueChange={(values) => {
                      field.onChange(values.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$ "
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromWeekDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia inicial de disponibilidade</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">🌞 Domingo</SelectItem>
                    <SelectItem value="1">🌝 Segunda</SelectItem>
                    <SelectItem value="2">🐫 Terça</SelectItem>
                    <SelectItem value="3">🐪 Quarta</SelectItem>
                    <SelectItem value="4">🌻 Quinta</SelectItem>
                    <SelectItem value="5">🍀 Sexta</SelectItem>
                    <SelectItem value="6">🎉 Sábado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToWeekDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia final de disponibilidade</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um dia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">🌞 Domingo</SelectItem>
                    <SelectItem value="1">🌝 Segunda</SelectItem>
                    <SelectItem value="2">🐫 Terça</SelectItem>
                    <SelectItem value="3">🐪 Quarta</SelectItem>
                    <SelectItem value="4">🌻 Quinta</SelectItem>
                    <SelectItem value="5">🍀 Sexta</SelectItem>
                    <SelectItem value="6">🎉 Sábado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>⏰ Horário de início</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário de início" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>🌅 Manhã</SelectLabel>
                      <SelectItem value="05:00">05:00</SelectItem>
                      <SelectItem value="05:30">05:30</SelectItem>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="06:30">06:30</SelectItem>
                      <SelectItem value="07:00">07:00</SelectItem>
                      <SelectItem value="07:30">07:30</SelectItem>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="08:30">08:30</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="09:30">09:30</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="10:30">10:30</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="11:30">11:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>🌞 Tarde</SelectLabel>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="12:30">12:30</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="13:30">13:30</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="14:30">14:30</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="15:30">15:30</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="16:30">16:30</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                      <SelectItem value="17:30">17:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>🌙 Noite</SelectLabel>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="18:30">18:30</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                      <SelectItem value="19:30">19:30</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="20:30">20:30</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                      <SelectItem value="21:30">21:30</SelectItem>
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
                <FormLabel>⏰ Horário de término</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um horário de início" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>🌅 Manhã</SelectLabel>
                      <SelectItem value="05:00">05:00</SelectItem>
                      <SelectItem value="05:30">05:30</SelectItem>
                      <SelectItem value="06:00">06:00</SelectItem>
                      <SelectItem value="06:30">06:30</SelectItem>
                      <SelectItem value="07:00">07:00</SelectItem>
                      <SelectItem value="07:30">07:30</SelectItem>
                      <SelectItem value="08:00">08:00</SelectItem>
                      <SelectItem value="08:30">08:30</SelectItem>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="09:30">09:30</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="10:30">10:30</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="11:30">11:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>🌞 Tarde</SelectLabel>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="12:30">12:30</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="13:30">13:30</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="14:30">14:30</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="15:30">15:30</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="16:30">16:30</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                      <SelectItem value="17:30">17:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>🌙 Noite</SelectLabel>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="18:30">18:30</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                      <SelectItem value="19:30">19:30</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                      <SelectItem value="20:30">20:30</SelectItem>
                      <SelectItem value="21:00">21:00</SelectItem>
                      <SelectItem value="21:30">21:30</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={upsertDoctorAction.isExecuting}>
              {upsertDoctorAction.isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
