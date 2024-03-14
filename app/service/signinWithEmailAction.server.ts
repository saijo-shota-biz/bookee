import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";
import * as v from "valibot";
import { badRequest } from "~/uitl/response";
import { AuthorizationError } from "remix-auth";

const signinWithEmailValidator = v.object({
  email: v.string("Your email must be a string.", [
    v.minLength(1, "Please enter your email."),
    v.email("The email address is badly formatted."),
  ]),
  password: v.string("Your password must be a string.", [
    v.minLength(1, "Please enter your password."),
    v.minLength(8, "Your password must have 8 characters or more."),
    v.maxLength(128, "Your password must have 128 characters or less."),
  ]),
});

export const signinWithEmailAction = async ({ request, context }: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context);

  const formData = await request.clone().formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const fields = { email, password };

  const result = v.safeParse(signinWithEmailValidator, fields, { abortPipeEarly: true });
  if (!result.success) {
    return badRequest({
      fields,
      fieldError: result.issues.reduce(
        (p, c) => {
          if (c.path) {
            p[c.path.map((p) => p.key).join(".")] = c.message;
          }
          return p;
        },
        {} as Record<string, string>,
      ),
      formError: "Invalid email or password",
    });
  }

  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/app",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return badRequest({
        fields,
        fieldError: null,
        formError: error.message,
      });
    }
    throw error;
  }
};
