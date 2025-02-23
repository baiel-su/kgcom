"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { updatePassword } from "@/actions/authActions";
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
import { useState, useTransition } from "react";
import { EyeClosed, Eye } from "lucide-react";

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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default NewPassword;
