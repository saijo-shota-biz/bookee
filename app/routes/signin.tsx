import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";
import { Form, Link, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { signinWithEmailAction } from "~/service/signinWithEmailAction.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export const action = signinWithEmailAction;

export default function SignInRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="py-32 flex flex-col items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          {actionData?.formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{actionData.formError}</AlertDescription>
            </Alert>
          )}

          <Form method="post" className="flex flex-col gap-4">
            <div>
              <Input name="email" type="text" placeholder="Email" />
              {actionData?.fieldError?.email && (
                <p className="text-red-500 text-xs mt-1 ml-2">{actionData.fieldError.email}</p>
              )}
            </div>
            <div>
              <Input name="password" type="password" placeholder="Password" />
              {actionData?.fieldError?.password && (
                <p className="text-red-500 text-xs mt-1 ml-2">{actionData.fieldError.password}</p>
              )}
            </div>
            <Button type="submit" variant="outline">
              Login with Email
            </Button>
          </Form>
          <hr />
          <Form method="post" action="/auth/google" className="w-full">
            <Button type="submit" variant="outline" className="w-full">
              Login with Google
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Button type="button" variant="link" asChild className="mt-2">
        <Link to="/signup">If you don't have an account yet, click here</Link>
      </Button>
    </main>
  );
}
