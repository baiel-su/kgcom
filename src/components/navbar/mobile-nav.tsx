"use client";

import {
    Calendar,
    Home,
    List,
    LogOut,
    MessageSquare,
    PlusCircle,
    User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import SignOutButton from "../signOutButton/signOutButton";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import UserProfileComponent from "../userProfile/userProfile";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileNavbarProps {
    userId: string;
}

export function MobileNavbar({ userId }: MobileNavbarProps) {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            label: "Home",
            href: "/",
            icon: <Home className="h-5 w-5" />,
        },
        {
            label: "Iftars",
            href: "/ramadan/iftar",
            icon: <Calendar className="h-5 w-5" />,
        },
        {
            label: "Create",
            href: "/ramadan/post/create-post",
            icon: <PlusCircle className="h-6 w-6" />,
        },
        {
            label: "Feedback",
            href: "/feedback",
            icon: <MessageSquare className="h-5 w-5" />,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background">
            <div className="grid h-16 grid-cols-5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Button
                            key={item.href}
                            asChild
                            variant="ghost"
                            className={cn(
                                "flex h-full flex-col items-center justify-center rounded-none",
                                item.label === "Create" && "relative",
                                isActive && "bg-muted"
                            )}
                        >
                            <Link href={item.href}>
                                {item.icon}
                                <span
                                    className={cn(
                                        "mt-1 text-xs",
                                        isActive ? "font-medium" : "text-muted-foreground"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        </Button>
                    );
                })}{" "}
                {userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div
                                className={
                                    " text-xs font-medium flex h-full flex-col items-center justify-center rounded-none gap-2"
                                }
                            >
                                <User className="h-5 w-5" />
                                <span>User</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <ul className="flex flex-col gap-3 max-w-[400px] p-4 md:max-w-[500px] lg:max-w-[600px] lg:min-w-[150px]">
                                <DropdownMenuItem asChild>
                                    <Sheet>
                                        <SheetTrigger className="text-sm">
                                            <div className="flex items-center gap-4">
                                                <User />
                                                Edit Profile
                                            </div>
                                        </SheetTrigger>

                                        <SheetContent>
                                            <UserProfileComponent />
                                        </SheetContent>
                                    </Sheet>
                                </DropdownMenuItem>
                                <hr />
                                <DropdownMenuItem>
                                    <Link href="/user-profile/my-posts">
                                        <div className="flex items-center text-sm gap-4">
                                            <List />
                                            My Posts
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

                                <hr />
                                <DropdownMenuItem>
                                    <Link href="/user-profile/my-joined-iftars">
                                        <div className="flex items-center text-sm gap-4">
                                            <List />
                                            My Joined Iftars
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

                                <hr />
                                <DropdownMenuItem>
                                    <div className="flex items-center text-sm gap-4">
                                        <LogOut /> <SignOutButton />
                                    </div>
                                </DropdownMenuItem>
                            </ul>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}
