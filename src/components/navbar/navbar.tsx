"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { JSX, SVGProps } from "react";
import SignOutButton from "../signOutButton/signOutButton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import UserProfileComponent from "../userProfile/userProfile";
import { useAuth } from "@/contexts/authContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/ramadan/iftar", label: "Iftar" },
  { href: "#", label: "Services" },
  { href: "/sds", label: "Contact" },
];

export default function Navbar() {
  const {user} = useAuth()
  // const pathname = usePathname();
  // const hideNavbar = ["/auth/sign-in", "/auth/sign-up"].includes(pathname);

  // if (hideNavbar) {
  //   return null;
  // }
  return (
    
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <div className="flex justify-between w-full lg:hidden">
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          {user ? (
            <NavigationMenu className="w-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger> {user?.email}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col max-w-[400px] p-4 md:w-[500px] lg:w-[600px]">
                      <NavigationMenuLink>Edit Profile</NavigationMenuLink>
                      <NavigationMenuLink>
                        <SignOutButton />
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Link
              href={"/auth/sign-in"}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
            >
              Sign In
            </Link>
          )}
        </div>
        <SheetContent side="left">
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <nav className="w-full hidden lg:flex lg:justify-between sm:items-center">
        <div>
          <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
        </div>
        <div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          {user ? (
            <NavigationMenu className="w-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger> {user?.email}</NavigationMenuTrigger>
                  <NavigationMenuContent className="">
                    <ul className="flex flex-col gap-3 max-w-[400px] p-4 md:max-w-[500px] lg:max-w-[600px] lg:min-w-[120px]">
                      <Sheet>
                        <SheetTrigger>Edit Profile </SheetTrigger>
                        <SheetContent>
                          <UserProfileComponent />
                        </SheetContent>
                      </Sheet>
                      <NavigationMenuLink></NavigationMenuLink>
                      <NavigationMenuLink>
                        <SignOutButton />
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Link
              href={"/auth/sign-in"}
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
