"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instagram, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useTransition } from "react";
import createFoodStoreAction from "@/actions/foodStoreActions";

const formSchema = z.object({
  store_name: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  instagram: z.string().optional(),
  storeImage: z.any().refine((file) => file, {
    message: "Store image is required",
  }),
});

export default function CateringApplicationForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store_name: "",
      description: "",
      address: "",
      phone: "",
      instagram: "",
      storeImage: undefined,
    },
  });

  const [, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the form data to your backend
    console.log(values);
    try {
      // Ensure the storeImage field contains a file
      if (!values.storeImage) {
        toast({
          title: "Error",
          description: "Please upload an image",
          variant: "destructive",
        });
        return;
      }

      // Upload the image using the uploadImage function
      const { imageUrl, error } = await uploadImage({
        file: values.storeImage,
        bucket: "store-images",
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Log the uploaded image URL (or use it in your application logic)
      console.log("Image uploaded successfully:", imageUrl);

      // Proceed with saving the form data (e.g., send it to your backend)
      // Example: Save the store data along with the image URL
      const storeData = {
        ...values,
        storeImage: imageUrl, // Replace the file with the uploaded image URL
      };

      console.log("Store data to save:", storeData);

      toast({
        title: "Store Created Successfully",
        description: "Redirecting you to create your menu...",
      });

      // Redirect to the menu creation page
      setTimeout(() => {
        router.push(`/catering/create-menu?storeId=mockStoreId`);
      }, 1500);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    const formData = new FormData();
    formData.append("store_name", form.getValues().store_name);
    formData.append("description", form.getValues().description);
    formData.append("address", form.getValues().address);
    formData.append("phone", form.getValues().phone);
    formData.append("instagram", form.getValues().instagram ?? "");
    formData.append("storeImage", form.getValues().storeImage[0]);

    // console.log(form.getValues());
    startTransition(async () => {
      const { errorMessage } = await createFoodStoreAction(formData);
      if (!errorMessage) {
        // router.push("/");

        toast({
          title: "Success",
          description: "Successfully created a post",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your store name" {...field} />
                  </FormControl>
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
                      placeholder="Describe your food catering services"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Tell us about your cuisine, specialties, and what makes your
                    food unique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your store address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        id="storeImage"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                      <label
                        htmlFor="storeImage"
                        className="cursor-pointer w-full h-full"
                      >
                        {field.value ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={
                                field.value
                                  ? URL.createObjectURL(field.value)
                                  : "/placeholder.svg"
                              }
                              alt="Store preview"
                              className="w-full max-h-[200px] object-contain mb-2"
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

            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input placeholder="Your Instagram handle" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Share your Instagram to help customers find you on social
                    media.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Store & Continue to Menu
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
