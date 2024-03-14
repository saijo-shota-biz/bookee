import { AppLoadContext } from "@remix-run/cloudflare";
import { getSessionStorage } from "~/uitl/session.server";
import { Authenticator, AuthorizationError } from "remix-auth";
import { User, users } from "~/schema/users";
import { GoogleStrategy } from "remix-auth-google";
import { createDBClient } from "~/uitl/db.server";
import { Env } from "~/types";
import { eq } from "drizzle-orm";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";

export const getAuthenticator = (context: AppLoadContext) => {
  const sessionStorage = getSessionStorage(context);
  const authenticator = new Authenticator<Omit<User, "password">>(sessionStorage);

  const googleStrategy = getGoogleStrategy(context);
  authenticator.use(googleStrategy);

  const formStrategy = getFormStrategy(context);
  authenticator.use(formStrategy, "user-pass");

  return authenticator;
};

const getGoogleStrategy = (context: AppLoadContext) => {
  const env = context.env as Env;
  return new GoogleStrategy<Omit<User, "password">>(
    {
      clientID: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: env.GOOGLE_CALLBACK_URL || "",
    },
    async ({ profile }) => {
      const database = createDBClient(env.DB);
      const user = await database.select().from(users).where(eq(users.email, profile.emails[0].value)).get();

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      const insertedUser = await database
        .insert(users)
        .values({
          email: profile.emails[0].value,
          username: profile.displayName,
          provider: "Google",
        })
        .returning()
        .get();

      const { password: _, ...userWithoutPassword } = insertedUser;
      return userWithoutPassword;
    },
  );
};

const getFormStrategy = (context: AppLoadContext) =>
  new FormStrategy<Omit<User, "password">>(async ({ form }) => {
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const database = createDBClient((context.env as Env).DB);
    const user = await database.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
      throw new AuthorizationError(`No user found with email: ${email}`);
    }

    if (!user.password) {
      throw new AuthorizationError(`User with email: ${email} is google user. Please login with google.`);
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      throw new AuthorizationError("passwords do not match.");
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  });
