import { AppLoadContext, createCookie, createWorkersKVSessionStorage } from "@remix-run/cloudflare";
import { Env } from "~/types";

export const getSessionStorage = (context: AppLoadContext) => {
  const env = context.env as Env;

  const sessionCookie = createCookie("__session", {
    secrets: [env.SESSION_SECRET],
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return createWorkersKVSessionStorage({
    // The KV Namespace where you want to store sessions
    kv: env.SESSION_KV,
    cookie: sessionCookie,
  });
};
