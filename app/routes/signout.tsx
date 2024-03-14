import { redirect } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";

export const loader = () => redirect("/signin");
export const action = ({ request, context }: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return authenticator.logout(request, {
    redirectTo: "/signin",
  });
};
