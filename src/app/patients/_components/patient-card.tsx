"use client";

import { useState } from "react";
import { patientsTable } from "@/db/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MailIcon, PhoneIcon, VenetianMaskIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as DialogHeaderUI,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpsertPatientForm } from "./upsert-patient-form";

type Patient = typeof patientsTable.$inferSelect;

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
  const [open, setOpen] = useState(false);
  const patientInitials = patient.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Verifica se o número tem 11 dígitos (com DDD)
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }

    // Se não tiver 11 dígitos, retorna o número original
    return phoneNumber;
  };

  return (
    <Card className="w-full p-4 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{patientInitials}</AvatarFallback>
          </Avatar>
          <h3 className="max-w-[180px] truncate text-lg font-semibold">
            {patient.name}
          </h3>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-3 py-4">
        <Badge variant="outline" className="py-1 text-base">
          <MailIcon className="mr-1 h-4 w-4" /> {patient.email}
        </Badge>
        <Badge variant="outline" className="py-1 text-base">
          <PhoneIcon className="mr-1 h-4 w-4" />{" "}
          {formatPhoneNumber(patient.phoneNumber)}
        </Badge>
        <Badge variant="outline" className="py-1 text-base capitalize">
          <VenetianMaskIcon className="mr-1 h-4 w-4" />
          {patient.sex === "male" ? "Masculino" : "Feminino"}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 w-full text-base font-medium">
              Ver detalhes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeaderUI>
              <DialogTitle>Editar paciente</DialogTitle>
            </DialogHeaderUI>
            <UpsertPatientForm
              onSuccess={() => setOpen(false)}
              {...patient}
            />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
