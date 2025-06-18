"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { upsertPatient } from "@/actions/upsert-patient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { upsertPatientSchema } from "@/actions/upsert-patient/schema";

type UpsertPatientFormValues = z.infer<typeof upsertPatientSchema>;

interface UpsertPatientFormProps extends Partial<UpsertPatientFormValues> {
  clinicId: string;
  onSuccess?: () => void;
}

export function UpsertPatientForm(props: UpsertPatientFormProps) {
  const form = useForm<UpsertPatientFormValues>({
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: {
      id: props.id,
      name: props.name ?? "",
      email: props.email ?? "",
      phoneNumber: props.phoneNumber ?? "",
      sex: props.sex,
      clinicId: props.clinicId,
    },
  });

  // Sempre que mudar o paciente (id), resetar o form
  useEffect(() => {
    form.reset({
      id: props.id,
      name: props.name ?? "",
      email: props.email ?? "",
      phoneNumber: props.phoneNumber ?? "",
      sex: props.sex,
      clinicId: props.clinicId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  const { execute, status } = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success("Paciente salvo com sucesso!");
      form.reset();
      props.onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao salvar paciente");
    },
  });

  const onSubmit = (data: UpsertPatientFormValues) => {
    execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do paciente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o email do paciente"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <PatternFormat
                  value={field.value}
                  onValueChange={(value) => {
                    const numericValue = value.value.replace(/\D/g, "");
                    field.onChange(numericValue);
                  }}
                  format="(##) #####-####"
                  mask="_"
                  customInput={Input}
                  placeholder="Digite o telefone do paciente"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={status === "executing"}
          className="w-full"
        >
          {status === "executing" ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
