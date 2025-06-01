"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/authentication"); // Redireciona para a tela de login
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold text-green-800">
          Fala, abacatinhos! 🥑
        </h1>
        <Button
          onClick={handleSignOut}
          className="bg-green-600 text-white transition hover:bg-green-700"
        >
          Sair da conta
        </Button>
      </div>
    </main>
  );
}
