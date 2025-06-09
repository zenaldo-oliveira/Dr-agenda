"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UpsertDoctorForm from "./upsert-doctor-form";

const AddDoctorButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2" />
          Adicionar Médico
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UpsertDoctorForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorButton;
