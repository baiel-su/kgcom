"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@radix-ui/themes";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { signInAction } from "@/actions/authActions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { EyeClosed, Eye } from "lucide-react";

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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


  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    const formData = new FormData();
    formData.append("email", form.getValues().email);
    formData.append("password", form.getValues().password);
    startTransition(async () => {
      const { errorMessage } = await signInAction(formData);
      if (!errorMessage) {
        router.push("/");
        // temporary use
        if (typeof window !== "undefined") {
          window.location.reload();
        }

        toast({
          title: "Success",
          description: "Successfully logged in",
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
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
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
                Sign In
              </Button>
                <Link href="/auth/reset-password" className="text-sm text-blue-500 hover:underline mt-2">
                Forgot Password?
                </Link>
            </form>
          </Form>
          {/* <hr /> */}
          {/* <Button className="w-full">
            <GoogleIcon className="mr-2 h-4 w-4" />
            Login with Google
          </Button> */}
          <div className="mt-4 text-center text-sm">
            Don not have an account?{" "}
            <Link className="underline" href="/auth/sign-up">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
});

