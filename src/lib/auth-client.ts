// src/lib/auth-client.ts
"use client";
import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
});
