"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { UpsertPatientForm } from "./upsert-patient-form";

interface AddPatientButtonProps {
  clinicId: string;
}

export function AddPatientButton({ clinicId }: AddPatientButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar paciente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar paciente</DialogTitle>
        </DialogHeader>
        <UpsertPatientForm
          clinicId={clinicId}
          onSuccess={() => {
            const closeButton = document.querySelector(
              '[data-dialog-close="true"]',
            ) as HTMLButtonElement;
            closeButton?.click();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
