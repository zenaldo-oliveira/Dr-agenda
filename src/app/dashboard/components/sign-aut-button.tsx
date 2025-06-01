"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const SignOutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await authClient.signOut();
        toast.success("Você saiu com sucesso!");
        router.push("/"); // redireciona para a home
      } catch (error) {
        toast.error("Erro ao sair. Tente novamente.");
      }
    });
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="destructive"
      className="gap-2"
      disabled={isPending}
    >
      <LogOut size={18} />
      {isPending ? "Saindo..." : "Sair"}
    </Button>
  );
};

export default SignOutButton;
