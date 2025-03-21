"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuItemForm } from "@/components/forms/catering/menuItemForm";

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      price: 9.99,
      category: "Main",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "French Fries",
      description: "Crispy golden fries with sea salt",
      price: 3.99,
      category: "Sides",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      name: "Chocolate Milkshake",
      description: "Rich and creamy chocolate shake",
      price: 4.99,
      category: "Drinks",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]);



  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Store #{storeId}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store's menu items
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Menu Item
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add New Menu Item</SheetTitle>
              <SheetDescription>
                Fill out the form below to add a new item to your menu.
              </SheetDescription>
            </SheetHeader>
            <MenuItemForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="h-48 bg-muted relative">
              <img
                src={"/table.jpg"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8 rounded-full"
                  onClick={() => deleteMenuItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.name}</CardTitle>
                <div className="text-lg font-bold">
                  ${item.price.toFixed(2)}
                </div>
              </div>
              <CardDescription className="text-sm">
                {item.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <span className="text-sm text-muted-foreground">
                ID: {item.id}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-muted-foreground">
            No menu items yet
          </h3>
          <p className="mt-2 text-muted-foreground">
            Click the "Add Menu Item" button to create your first menu item.
          </p>
        </div>
      )}
    </div>
  );
}
