import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";

export const loader = ({ request, context }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return authenticator.authenticate("google", request, {
    successRedirect: "/app",
    failureRedirect: "/signin",
  });
};
