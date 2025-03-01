"use client";
import { updateProfile } from "@/actions/editUserActions";
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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  const { setValue } = form;

  console.log(userData);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      console.log(data);
      setUserData(data);
      if (data) {
        setValue("full_name", data.full_name);
        setValue("address", data.address);
        setValue("phone", data.phone);
      }
    };

    getUserData();
  }, [setValue]);

  const router = useRouter();
  const onSubmit = (values: z.infer<typeof userSchema>) => {
    const form = new FormData();
    form.append("full_name", values.full_name); // Change to full_name
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
          <div className="flex flex-col gap-4">
            <Link href={"/auth/reset-password"} className="text-blue-500 hover:underline">Reset Password</Link>
            <Button type="submit">Submit</Button>
          </div>
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
