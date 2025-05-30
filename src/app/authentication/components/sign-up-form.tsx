"use client";

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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    email: z.string().trim().min(1, { message: "E-mail inválido" }).email(),
    password: z
      .string()
      .trim()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .trim()
      .min(8, { message: "Confirmação é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true);
    // Simulando delay de requisição
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Cadastro enviado:", values);
    setIsSubmitting(false);
  }

  return (
    <TabsContent value="register">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <CardHeader>
              <CardTitle>Crie sua conta</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para continuar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Digite seu nome completo"
                        {...field}
                        aria-invalid={!!form.formState.errors.name}
                        aria-describedby="name-error"
                      />
                    </FormControl>
                    <FormMessage id="name-error" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">E-mail</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby="email-error"
                      />
                    </FormControl>
                    <FormMessage id="email-error" />
                  </FormItem>
                )}
              />

              {/* Senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 8 caracteres"
                          {...field}
                          aria-invalid={!!form.formState.errors.password}
                          aria-describedby="password-error"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                          tabIndex={-1}
                          aria-label={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                          }
                        >
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage id="password-error" />
                  </FormItem>
                )}
              />

              {/* Confirmar Senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">
                      Confirme sua senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite novamente sua senha"
                          {...field}
                          aria-invalid={!!form.formState.errors.confirmPassword}
                          aria-describedby="confirmPassword-error"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                          tabIndex={-1}
                          aria-label={
                            showConfirmPassword
                              ? "Ocultar senha"
                              : "Mostrar senha"
                          }
                        >
                          {showConfirmPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage id="confirmPassword-error" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? "Criando conta..." : "Criar conta"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  );
};

export default SignUpForm;
