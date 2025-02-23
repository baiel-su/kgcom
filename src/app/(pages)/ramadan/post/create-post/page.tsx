"use client";
import createPostAction from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { format } from "path";

const formSchema = z.object({
  address: z.string().nonempty("Address is required"),
  max_guests: z.coerce.number().min(1, "Guests quantity must be at least 1"),
  gender: z.enum(["men", "women", "mixed"]).refine((val) => val !== undefined, {
    message: "Gender is required",
  }),
  hostDate: z.date().refine((val) => val !== undefined, {
    message: "Host date is required",
  }),
});

const CreatePost = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      max_guests: 0,
      gender: "mixed",
      hostDate: new Date(),
    },
  });

  const router = useRouter();

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("gender", form.getValues().gender);
    formData.append("address", form.getValues().address);
    formData.append("max_guests", form.getValues().max_guests.toString());
    formData.append("hostDate", form.getValues().hostDate.toString());
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
  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <p className="mb-6 text-gray-600">
        Fill out the form below to create a new post for the Ramadan event.
      </p>
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
              name="hostDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Hosting date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !form.watch("hostDate") && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("hostDate") ? (
                            format(form.watch("hostDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                        </PopoverContent>
                    </Popover>
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
    </div>
  );
};

export default CreatePost;
