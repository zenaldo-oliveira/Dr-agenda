"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    // Simula fetch de nome do usuário (troque por sua lógica real)
    setUserName("Zenaldo");
  }, []);

  function handleLogout() {
    // Aqui você pode limpar tokens, cookies ou chamar seu authClient.signOut()
    router.push("/authentication"); // redireciona para página de login
  }

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="text-center shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              🎉 Bem-vindo, {userName}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Este é o início do seu painel. Mais funcionalidades em breve!
            </p>
            <button
              onClick={handleLogout}
              className="transform rounded-2xl bg-blue-600 px-6 py-2 font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 active:scale-95"
            >
              sair
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
