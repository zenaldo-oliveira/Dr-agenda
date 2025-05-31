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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SignUpForm from "@/app/authentication/components/sign-up-form";
import LoginForm from "./components/login-form";

const AuthenticationPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
