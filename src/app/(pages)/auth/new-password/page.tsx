"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { sendResetPasswordEmail, updatePassword } from "@/actions/authActions";

const ResetEmailSchema = z.object({
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

const NewPassword = () => {
  const form = useForm<z.infer<typeof ResetEmailSchema>>({
    defaultValues: {
      password: "",
    },
  });
    const [isPending, startTransition] = useTransition();
  
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("password", form.getValues().password);
    startTransition(async () => {
      const { errorMessage } = await updatePassword(formData);
      if (!errorMessage) {
        toast({
          title: "Success",
          description: "Successfully updated password",
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
    <div className="md:w-[400px] m-auto md:border p-4 rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormDescription>Enter your new password</FormDescription>
                <FormControl>
                  <Input placeholder="*******" type="password" {...field} />
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

export default NewPassword;
