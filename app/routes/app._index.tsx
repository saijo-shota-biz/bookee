import {Form, json, useLoaderData} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {LoaderFunctionArgs} from "@remix-run/cloudflare";
import {getAuthenticator} from "~/uitl/auth.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return json({ user });
};

export default function AppIndexRoute() {
  const { user } = useLoaderData<typeof loader>();
  return <div>Welcome to {user.username}</div>;
}
