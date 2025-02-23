"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@radix-ui/themes";
import Image from "next/image";
import { useState, useTransition } from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { signUpAction } from "@/actions/authActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().min(2).max(50).email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    }),
  full_name: z.string().min(2).max(50),
  address: z.string().min(2).max(50),
  phone: z.string().min(2).max(50),
});

export default function SignUpPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      address: "",
      phone: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState<React.ReactNode>(<EyeClosed />);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(<Eye />);
      setType("text");
    } else {
      setIcon(<EyeClosed />);
      setType("password");
    }
  };

  async function onSubmit() {
    const formData = new FormData();
    formData.append("email", form.getValues().email);
    formData.append("password", form.getValues().password);
    formData.append("full_name", form.getValues().full_name);
    formData.append("address", form.getValues().address);
    formData.append("phone", form.getValues().phone);
    startTransition(async () => {
      const { errorMessage } = await signUpAction(formData);
      if (!errorMessage) {
        router.replace("/");
        // temporary use
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        toast({
          title: "Success",
          description: "Successfully signed up",
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
    <div className="flex h-screen">
      {/* Image Section */}
      <div className="relative hidden lg:block w-2/3">
        <Image
          src="/thumb.jpeg"
          alt="Login background"
          layout="fill"
          objectFit="cover"
          priority
          className=""
        />
      </div>
      <hr />
      {/* Login Form Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center border-l-2">
        <div className="mx-auto w-full max-w-sm space-y-6 px-4 sm:px-0">
          <div className="space-y-2 text-center flex flex-col items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={65} // Adjust the width as needed
              height={65} // Adjust the height as needed
              className="mb-2 text-center" // Adds margin below the logo
            />
            <h1 className="text-3xl font-bold">Welcome </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to create your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your address" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
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
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="******"
                            required
                            {...field}
                            type={type}
                          />
                          <span
                            onClick={handleToggle}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          >
                            {icon}
                          </span>
                        </div>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
              <Link
                href="/auth/reset-password"
                className="text-sm text-blue-500 hover:underline mt-2"
              >
                Forgot Password?
              </Link>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link className="underline" href="/auth/sign-in">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
