import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";
import { Form, Link, useActionData } from "@remix-run/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import React from "react";
import { signupWithEmailAction } from "~/service/signupWithEmailAction.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export const action = signupWithEmailAction;

export default function SingUpRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="py-32 flex flex-col items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create New Account</CardTitle>
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
            <div>
              <Input name="passwordConfirm" type="password" placeholder="Password Confirm" />
              {actionData?.fieldError?.passwordConfirm && (
                <p className="text-red-500 text-xs mt-1 ml-2">{actionData.fieldError.passwordConfirm}</p>
              )}
            </div>
            <Button type="submit" variant="outline">
              Create Account
            </Button>
          </Form>
        </CardContent>
      </Card>

      <Button type="button" variant="link" asChild className="mt-2">
        <Link to="/signin">If you already have an account, click here</Link>
      </Button>
    </main>
  );
}
