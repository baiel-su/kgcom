"use client";

import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

import MenuItem from "@/components/catering/menuItem";
import { MenuItemForm } from "@/components/forms/catering/menuItemForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFetchstore } from "@/hooks/use-fetch-single-store";
import { useMediaQuery } from "@/lib/mediaQuery";

// Define the MenuItem type
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
};

export default function StorePage() {
  const { storeId } = useParams();
  const { store } = useFetchstore(storeId as string);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-bold">{store?.store_name} </h1>
          <p className="text-muted-foreground mt-1">
            Manage your store&#39;s menu items
          </p>
          <p>
            <span className="font-semibold">Phone number: </span>
            <span>{store?.phone}</span>
          </p>
        </div>
      </div>
      <div className="block mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </SheetTrigger>
          <SheetContent
            className="sm:max-w-md"
            side={isMobile ? "bottom" : "right"}
          >
            <SheetHeader>
              <SheetTitle>Add New Menu Item</SheetTitle>
              <SheetDescription>
                Fill out the form below to add a new item to your menu.
              </SheetDescription>
            </SheetHeader>
            <MenuItemForm storeId={storeId} />
          </SheetContent>
        </Sheet>
      </div>
      {store && <MenuItem menuItem={store} />}
    </div>
  );
}
