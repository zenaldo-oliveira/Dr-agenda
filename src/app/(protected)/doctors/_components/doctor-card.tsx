"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { CalendarIcon, ClockIcon, DollarSignIcon } from "lucide-react";
import UpsertDoctorForm from "./upsert-doctor-form";

interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const doctorInitials = doctor.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-x-1">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          segunda a sexta
        </Badge>
        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          {doctor.availableFromTime} - {doctor.availableToTime}
        </Badge>
        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {(doctor.appointmentPriceInCents / 100).toFixed(2)}
        </Badge>
      </CardContent>
      <Separator />
      <CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Ver detalhes</Button>
            </DialogTrigger>
            <UpsertDoctorForm />
          </Dialog>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
