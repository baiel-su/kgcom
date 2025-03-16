"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MenuItemForm from "@/components/forms/catering/menuItemForm";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  vegetarian: boolean;
  image?: File;
};

export default function CreateMenuPage() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const handleAddMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem = {
      ...item,
      id: `item_${Math.random().toString(36).substring(2, 9)}`,
    };
    setMenuItems([...menuItems, newItem]);
    setShowForm(false);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(
      menuItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    setDeleteItemId(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Create Your Menu</h1>
          <p className="text-muted-foreground mt-2">
            Add items to your catering menu. You can add as many items as you
            want.
          </p>
          <p className="text-sm text-muted-foreground">Store ID: {storeId}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>
              Add food items that will be available for catering
            </CardDescription>
          </CardHeader>
          <CardContent>
            {menuItems.length > 0 ? (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start gap-4">
                      {item.image && (
                        <img
                          src={
                            URL.createObjectURL(item.image) ||
                            "/placeholder.svg"
                          }
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex gap-4 mt-2">
                          <p className="text-sm font-medium">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditItem(item)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No menu items added yet</p>
              </div>
            )}

            <Separator className="my-6" />

            {showForm ? (
              <MenuItemForm
                onSave={editingItem ? handleUpdateMenuItem : handleAddMenuItem}
                onCancel={handleCancelForm}
                initialData={
                  editingItem
                    ? { ...editingItem, price: editingItem.price.toString() }
                    : null
                }
              />
            ) : (
              <Button
                onClick={() => setShowForm(true)}
                className="w-full"
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              // Here you would save the entire menu to your backend
              alert("Menu saved successfully!");
            }}
            disabled={menuItems.length === 0}
          >
            Save Menu
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={() => setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this menu item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
