import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";
import * as v from "valibot";
import { badRequest } from "~/uitl/response";
import { AuthorizationError } from "remix-auth";
import { createDBClient } from "~/uitl/db.server";
import { Env } from "~/types";
import { users } from "~/schema/users";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const SignupWithEmailSchema = v.object(
  {
    email: v.string("Your email must be a string.", [
      v.minLength(1, "Please enter your email."),
      v.email("The email address is badly formatted."),
    ]),
    password: v.string("Your password must be a string.", [
      v.minLength(1, "Please enter your password."),
      v.minLength(8, "Your password must have 8 characters or more."),
      v.maxLength(128, "Your password must have 128 characters or less."),
    ]),
    passwordConfirm: v.string("Your password must be a string.", [
      v.minLength(1, "Please enter your password confirm."),
    ]),
  },
  [
    v.forward(
      v.custom(({ password, passwordConfirm }) => password === passwordConfirm, "password confirm do not match."),
      ["passwordConfirm"],
    ),
  ],
);

type SignupWithEmailSchemaType = v.Input<typeof SignupWithEmailSchema>;

export const signupWithEmailAction = async ({ request, context }: ActionFunctionArgs) => {
  const authenticator = getAuthenticator(context);

  const formData = await request.clone().formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const passwordConfirm = String(formData.get("passwordConfirm"));

  const fields = { email, password, passwordConfirm };

  const result = v.safeParse(SignupWithEmailSchema, fields, { abortPipeEarly: true });
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
      formError: "Invalid email or password or password confirm.",
    });
  }

  const database = createDBClient((context.env as Env).DB);
  const existingUser = await database.select().from(users).where(eq(users.email, email)).get();
  if (existingUser) {
    return badRequest({
      fields,
      fieldError: null,
      formError: "User already exists.",
    });
  }
  try {
    await database.insert(users).values({
      email: email,
      username: email.split("@")[0],
      password: await bcrypt.hash(password, 10),
    });
  } catch (error) {
    return badRequest({
      fields,
      fieldError: null,
      formError: "Create Your Account Failed.",
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
