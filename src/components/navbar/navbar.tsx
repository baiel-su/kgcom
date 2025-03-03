"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/authContext";
import { List, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { MobileNavbar } from "./mobile-nav";
import { ModeToggle } from "../dark-mode/dark-mode";

const links = [
  { href: "/", label: "Home" },
  { href: "/ramadan/iftar", label: "Iftar" },
  // { href: "#", label: "Services" },
  // { href: "/sds", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const { user } = useAuth();
  console.log(user);
  const hideNavbar = ["/auth/sign-in", "/auth/sign-up"].includes(pathname);

  if (hideNavbar) {
    return null;
  }

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      {/* mobile */}
      <div className="flex justify-between w-full lg:hidden">
        <div className="flex items-center justify-between w-full">
          <Image
            src="/bread.png"
            alt="Logo"
            width={65} // Adjust the width as needed
            height={65} // Adjust the height as needed
            className=" text-center" // Adds margin below the logo
          />
          <div className="flex items-center gap-2">
            <ModeToggle />
            {user ? (
              <span>{user.email}</span>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/sign-in"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <MobileNavbar userId={user?.id as string} />
        </div>
      </div>

      {/* large screen */}
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-sm bg-gray-100 dark:bg-transparent text-gray-400 rounded-md">
              beta
            </span>
            <ModeToggle />
          </div>
          {user ? (
            <NavigationMenu className="w-full">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <div className="flex items-center gap-2">
                    <NavigationMenuTrigger
                      onPointerMove={(e) => e.preventDefault()}
                    >
                      {user?.email}
                    </NavigationMenuTrigger>
                  </div>
                  <NavigationMenuContent className="">
                    <ul className="flex flex-col gap-3 max-w-[400px] p-4 md:max-w-[500px] lg:max-w-[600px] lg:min-w-[150px]">
                      <Sheet>
                        <SheetTrigger className="text-sm">
                          <div className="flex items-center gap-4">
                            <User />
                            Edit Profile{" "}
                          </div>
                        </SheetTrigger>
                        <SheetContent>
                          <UserProfileComponent />
                        </SheetContent>
                      </Sheet>
                      <hr />
                      <NavigationMenuLink href="/user-profile/my-posts">
                        <div className="flex items-center text-sm gap-4">
                          <List />
                          My Posts
                        </div>
                      </NavigationMenuLink>
                      <hr />
                      <NavigationMenuLink>
                        <div className="flex items-center text-sm gap-4">
                          <LogOut /> <SignOutButton />
                        </div>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <Link
              href={"/auth/sign-in"}
              className="text-black group inline-flex h-9 w-max items-center justify-center rounded-md bg-gray-200 dark:bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50  dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
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
