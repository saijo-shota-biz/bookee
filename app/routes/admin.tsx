import { json, Link, Outlet, useLoaderData } from "@remix-run/react";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { HeadersFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { unauthorized } from "~/uitl/response";
import { Env } from "~/types";
import { createDBClient } from "~/uitl/db.server";
import { users } from "~/schema/users";
import type { AppLoadContext } from "@remix-run/server-runtime/dist/data";

export const headers: HeadersFunction = () => ({
  "WWW-Authenticate": "Basic ",
});

const isAuthorized = (request: Request, context: AppLoadContext) => {
  const header = request.headers.get("Authorization");

  if (!header) return false;

  const base64 = header.replace("Basic ", "");
  const [username, password] = Buffer.from(base64, "base64").toString().split(":");

  const env = context.env as Env;
  return username === env.ADMIN_PAGE_BASIC_AUTH_USER && password === env.ADMIN_PAGE_BASIC_AUTH_PASS;
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  if (!isAuthorized(request, context)) {
    return unauthorized({ authorized: false });
  }

  return json({ authorized: true });
};

export default function AdminRoute() {
  const { authorized } = useLoaderData<typeof loader>();

  if (!authorized) {
    return <UnauthorizedError />;
  }

  return (
    <>
      <nav className="flex py-2 px-4">
        <Link to={"/admin"} prefetch={"intent"}>
          <h1 className="py-2 px-4">Admin Tool Pages</h1>
        </Link>

        <div className="grow" />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to={"/app"} prefetch={"intent"}>
                  APP
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to={"/admin/seed"} prefetch={"intent"} className={navigationMenuTriggerStyle()}>
                  SEED
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <main className="py-2 px-8">
        <Outlet />
      </main>
    </>
  );
}

function UnauthorizedError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Unauthorized Access</h2>
          <p className="mt-2 text-center text-sm text-gray-600">You are not authorized to access this page.</p>
        </div>
      </div>
    </div>
  );
}
