"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

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

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
                        <Input placeholder="******" required {...field} />
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
              <Link href="/auth/reset-password">Forgot Password?</Link>
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

// const GoogleIcon = (props: LucideProps) => (
//   <svg {...props} viewBox="0 0 24 24">
//     <path
//       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//       fill="#4285F4"
//     />
//     <path
//       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//       fill="#34A853"
//     />
//     <path
//       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//       fill="#FBBC05"
//     />
//     <path
//       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//       fill="#EA4335"
//     />
//     <path d="M1 1h22v22H1z" fill="none" />
//   </svg>
// );
