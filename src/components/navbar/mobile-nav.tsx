"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, PlusCircle, MessageSquare, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function MobileNavbar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Iftars",
      href: "/iftars",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Create",
      href: "/create",
      icon: <PlusCircle className="h-6 w-6" />,
    },
    {
      label: "Feedback",
      href: "/feedback",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      label: "User",
      href: "/user",
      icon: <User className="h-5 w-5" />,
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
                {item.label === "Create" ? (
                  <div className="absolute -top-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {item.icon}
                  </div>
                ) : (
                  item.icon
                )}
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
        })}
      </div>
    </div>
  );
}
