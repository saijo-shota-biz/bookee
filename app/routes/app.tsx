import { Form, json, Link, Outlet, useLoaderData } from "@remix-run/react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import React from "react";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "~/uitl/auth.server";
import {isProduction} from "~/uitl/env";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  return json({ user });
};
export default function AppRoute() {
  return (
    <>
      <nav className="flex py-2 px-4">
        <h1 className="py-2 px-4">
          <Link to={"/app"} prefetch={"intent"}>
            BooKee
          </Link>
        </h1>

        <div className="grow" />

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {
                isProduction && (
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link to={"/admin"} prefetch={"none"}>
                      Admin
                    </Link>
                  </NavigationMenuLink>
                )
              }
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Form method={"post"} action={"/signout"}>
                  <button type={"submit"}>Logout</button>
                </Form>
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
