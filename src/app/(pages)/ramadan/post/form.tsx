"use client";

import createPostAction from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  address: z.string().nonempty("Address is required"),
  max_guests: z.coerce.number().min(1, "Guests quantity must be at least 1"),
  gender: z.enum(["men", "women", "mixed"]).refine((val) => val !== undefined, {
    message: "Gender is required",
  }),
});

export function PostFormContent() {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      max_guests: 0,
      gender: "mixed",
    },
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const router = useRouter();

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("gender", form.getValues().gender);
    formData.append("address", form.getValues().address);
    formData.append("max_guests", form.getValues().max_guests.toString());
    // console.log(form.getValues());
    startTransition(async () => {
      const { errorMessage } = await createPostAction(formData);
      if (!errorMessage) {
        router.push("/");
        // temporary use
        // if (typeof window !== 'undefined') {
        //   window.location.reload();
        // }

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
  };
  // const onSubmit = (data: z.infer<typeof formSchema>) => {
  //   console.log(data);
  // }; // return (
  const FormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
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
            name="max_guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests quantity</FormLabel>
                <FormControl>
                <Input
                    type="number"
                    placeholder="Enter guests quantity"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.max_guests?.message}
                </FormMessage>
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="max_guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests quantity</FormLabel>
                <FormControl>
                <Input
                    type="number"
                    placeholder="Enter guests quantity"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.max_guests?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Notify me about...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="men" />
                      </FormControl>
                      <FormLabel className="font-normal">Men</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="women" />
                      </FormControl>
                      <FormLabel className="font-normal">Women</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="mixed" />
                      </FormControl>
                      <FormLabel className="font-normal">Mixed</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );

  if (typeof window === "undefined") {
    return null;
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Invite guests</Button>
        </DrawerTrigger>
        <DrawerContent  onOpenAutoFocus={(e) => e.preventDefault()}>
          <DrawerHeader>
            <DrawerTitle>Fill out the form</DrawerTitle>
            <DrawerDescription>
              Please provide your information below.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <FormContent />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite guests</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]"  onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Fill out the form</DialogTitle>
          <DialogDescription>
            Please provide your information below.
          </DialogDescription>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
}
