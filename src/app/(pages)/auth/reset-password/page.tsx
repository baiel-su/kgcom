"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { sendResetPasswordEmail } from "@/actions/authActions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";

const ResetEmailSchema = z.object({
  email: z.string().email(),
});

const ResetPassword = () => {
  const form = useForm<z.infer<typeof ResetEmailSchema>>({
    defaultValues: {
      email: "",
    },
  });
    const [isPending, startTransition] = useTransition();
  
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("email", form.getValues().email);
    startTransition(async () => {
      const { errorMessage } = await sendResetPasswordEmail(formData);
      if (!errorMessage) {
        toast({
          title: "Success",
          description: "Check your email for the reset link",
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
    <div className="w-[400px] m-auto border p-4 rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormDescription>Enter your email to send reset link</FormDescription>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
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

export default ResetPassword;
