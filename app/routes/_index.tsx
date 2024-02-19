import type { MetaFunction } from "@remix-run/cloudflare";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { db } from "~/uitl/db";
import { users } from "~/schema/users";
import { Env } from "~/types";
import { json, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const u = await db((context.env as Env).DB)
    .select()
    .from(users)
    .all();

  return json({ users: u });
};

export default function Index() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <div>
      <Button>test</Button>
    </div>
  );
}
