import { Form, json, redirect } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Env } from "~/types";
import { db } from "~/uitl/db";
import { users } from "~/schema/users";
import { Button } from "~/components/ui/button";

export const loader = async () => {
  if (process.env.NODE_ENV === "production") {
    throw redirect("/");
  }
  return json({});
};

export const action = async ({ context }: ActionFunctionArgs) => {
  const database = db((context.env as Env).DB);
  await database.delete(users).all();
  await database.insert(users).values({
    email: "test@example.com",
    username: "test",
    password: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u", // twixrox
  });

  return redirect("/");
};

export default function AdminSeed() {
  return (
    <Form method="post">
      <Button type={"submit"}>Insert Seed Data</Button>
    </Form>
  );
}
