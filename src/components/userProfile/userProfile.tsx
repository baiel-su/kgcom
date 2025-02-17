"use client";
import React, { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Adjust the import path according to your project structure
import { fetchUserData } from "@/data/userData";
import { User } from "@supabase/supabase-js";
import { updateProfile } from "@/actions/editUserActions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const UserProfileComponent: React.FC = () => {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      full_name: "",
      address: "",
      phone: "",
    },
  });

  const [userData, setUserData] = useState<z.infer<typeof userSchema> | null>(
    null
  );
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUserData(data);
      if (data) {
        form.setValue("full_name", data.full_name);
        form.setValue("address", data.address);
        form.setValue("phone", data.phone);
      }
    };

    getUserData();
  }, []);
  

  console.log(userData?.phone);

  const router = useRouter();
  const onSubmit = (values: z.infer<typeof userSchema>) => {
    const form = new FormData();
    form.append("full_name", values.full_name); // Change to full_name
    form.append("address", values.address);
    form.append("phone", values.phone); // Change to phone

    startTransition(async () => {
      const { errorMessage } = await updateProfile(form);

      // Debugging: Log response from updateProfile
      console.log("Update Profile Response:", errorMessage);

      if (!errorMessage) {
        router.push("/");
        toast({
          title: "Success",
          description: "Successfully updated your profile",
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
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    // defaultValue={userData?.full_name}
                    placeholder="John"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    // defaultValue={userData?.address}
                    placeholder="123 Main St"
                    {...field}
                  />
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
                  <Input
                    // defaultValue={userData?.phone}
                    placeholder="1234567890"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileComponent;

const userSchema = z.object({
  full_name: z.string().nonempty({ message: "First name is required" }),
  address: z.string().nonempty({ message: "Address is required" }),
  phone: z
    .string()
    .nonempty({ message: "Phone number is required" })
    .regex(/^\d+$/, "Phone number must be numeric"),
});
