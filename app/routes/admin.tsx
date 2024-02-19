import {Link, Outlet} from "@remix-run/react";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

export default function AdminRoute() {
  return (
    <>
      <nav className="flex">
        <h1 className="py-2 px-4">
          <Link to={"/admin"} prefetch={"intent"}>
            Admin Tool Pages
          </Link>
        </h1>
        <div className="grow" />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to={"/admin/seed"} prefetch={"intent"}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Seed</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <main className="py-2 px-4">
        <Outlet />
      </main>
    </>
  );
}
