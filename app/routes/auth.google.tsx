import { getAuthenticator } from "~/uitl/auth.server";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/react";

export const loader = () => redirect("/signin");
export const action = ({ request, context }: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return authenticator.authenticate("google", request);
};
