import type { MetaFunction } from "@remix-run/cloudflare";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";

export const meta: MetaFunction = () => {
  return [{ title: "Bookee" }, { name: "description", content: "Book Keeping Web App" }];
};

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/app",
    failureRedirect: "/signin",
  });
};
