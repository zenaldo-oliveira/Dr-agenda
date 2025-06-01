"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ClinicForm from "./components/form";

const ClinicFormPage = () => {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Clínica</DialogTitle>
          <DialogDescription>
            Preencha os campos para cadastrar uma nova clínica.
          </DialogDescription>
        </DialogHeader>
        <ClinicForm /> {/* agora fora do DialogHeader */}
      </DialogContent>
    </Dialog>
  );
};

export default ClinicFormPage;
