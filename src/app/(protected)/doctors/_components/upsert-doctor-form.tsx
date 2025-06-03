import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "lucide-react";
import z from "zod";
import { medicalSpecialties } from "../_constants";

const doctorSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  speciality: z.string().trim().min(1, {
    message: "Especialidade é obrigatória",
  }),
  appointmentsPrice: z.number().min(1, {
    message: "Preço é obrigatório",
  }),
  availableFromWeek: z.number(),
  availableToweekDay: z.number(),
  availableFromTime: z.string().min(1, {
    message: "Hora de início é obrigatória",
  }),
  availableToTime: z.string().min(1, {
    message: "Hora de término é obrigatória",
  }),
});

const UpsertDoctorForm = () => {
  const form = useForm<z.infer<typeof doctorSchema>>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      speciality: "",
      appointmentsPrice: 0,
      availableFromWeek: 0,
      availableToweekDay: 0,
      availableFromTime: "",
      availableToTime: "",
    },
  });

  const onSubmit = (values: z.infer<typeof doctorSchema>) => {
    console.log(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Médico</DialogTitle>
        <DialogDescription>
          Adicione um novo médico para o sistema
        </DialogDescription>
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
            name="speciality"
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

          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
