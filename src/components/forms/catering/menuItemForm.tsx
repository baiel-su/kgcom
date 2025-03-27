"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createFoodMenuAction } from "@/actions/foodStoreActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/lib/imageUploader";
import { Spinner } from "@radix-ui/themes";
import Image from "next/image";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
  image: z.any().refine((file) => file, {
    message: "Store image is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface IMenuItemProps {
  storeId: string | string[] | undefined;
}

export function MenuItemForm({ storeId }: IMenuItemProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      startTransition(async () => {
        // Ensure the image field contains a file
        if (!values.image) {
          toast({
            title: "Error",
            description: "Please upload an image",
            variant: "destructive",
          });
          return;
        }

        // // Upload the image using the uploadImage function
        const { imageUrl, error } = await uploadImage({
          file: values.image,
          bucket: "menu-images",
        });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // // Update the image field with the uploaded image URL
        values.image = imageUrl;

        const formData = new FormData();
        formData.append("item_name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price.toString());
        formData.append("image", values.image);

        const { errorMessage } = await createFoodMenuAction(
          formData,
          storeId as string
        );
        if (!errorMessage) {
          toast({
            title: "Success",
            description: "Successfully created a menu",
            variant: "default",
          });
          if (typeof window !== "undefined") {
            window.location.reload();
          }
  
        } else {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      });
    } catch (err) {
      console.error("Error during form submission:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Delicious Burger" {...field} />
              </FormControl>
              <FormDescription>The name of your menu item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A juicy burger with all the fixings..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe your menu item in detail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Image</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer w-full h-full"
                  >
                    {field.value ? (
                      <div className="flex flex-col items-center">
                        <Image
                          src={
                            field.value
                              ? URL.createObjectURL(field.value)
                              : "/placeholder.svg"
                          }
                          alt="Store preview"
                          className="w-full max-h-[100px] object-contain mb-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          Click to upload store image
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          SVG, PNG, JPG or GIF (max. 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Add Menu Item
        </Button>
      </form>
    </Form>
  );
}
