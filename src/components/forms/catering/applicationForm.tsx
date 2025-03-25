"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instagram, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import createFoodStoreAction from "@/actions/foodStoreActions";
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
import { Spinner } from "@radix-ui/themes";
import Image from "next/image";
import { useTransition } from "react";

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
  instagram_link: z.string().optional(),
  image: z.any().refine((file) => file, {
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
      instagram_link: "",
      image: undefined,
    },
  });

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

        // // Update the image field with the uploaded image URL
        values.image = imageUrl;

        // Proceed with saving the form data (e.g., send it to your backend)
        const formData = new FormData();
        formData.append("store_name", values.store_name);
        formData.append("description", values.description);
        formData.append("address", values.address);
        formData.append("phone", values.phone);
        formData.append("instagram_link", values.instagram_link ?? "");
        formData.append("image", values.image);

        const { errorMessage } = await createFoodStoreAction(formData);
        if (!errorMessage) {
          toast({
            title: "Success",
            description: "Successfully created a post",
            variant: "default",
          });
            router.push(`/catering/stores`);
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
  }

  return (
    <Card className="border-none shadow-none md:border md:shadow p-0  w-full max-w-2xl mx-auto">
      <CardContent className="pt-6 p-0 md:p-6">
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
                    <div className="flex justify-center items-center">
                      <span className="text-sm rounded-md border border-input  px-3 py-[7px]  shadow-sm rounded-r-none border-r-0">
                        +1
                      </span>
                      <Input
                        // defaultValue={userData?.phone}
                        placeholder="856984522"
                        maxLength={10}
                        {...field}
                        className="rounded-l-none py-2"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="instagram_link"
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Store & Continue to Menu
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
