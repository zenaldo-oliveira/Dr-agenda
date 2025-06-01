"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "E-mail é obrigatório" })
    .email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(1, { message: "Senha é obrigatória" })
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
});

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.senha,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("E-mail ou senha inválido");
        },
      },
    );
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu e-mail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                        title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
