import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";
import { json } from "@remix-run/react";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return json({ user });
};

export default function AppTransactionsRoute() {
  return (
    <>
      <h2 className="text-2xl">Transactions Page</h2>
    </>
  );
}
