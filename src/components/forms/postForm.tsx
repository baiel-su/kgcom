import createPostAction from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { IPost } from "@/hooks/use-fetch-posts";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  address: z.string().nonempty("Address is required"),
  iftar_type: z
    .enum(["dine_in", "take_out"])
    .refine((val) => val !== undefined, {
      message: "Dinner type is required",
    }),
  max_guests: z.coerce.number().min(1, "Guests quantity must be at least 1"),
  gender: z.enum(["men", "women", "mixed"]).refine((val) => val !== undefined, {
    message: "Gender is required",
  }),
  hostDate: z.string(),
});

interface PostFormProps {
  post: IPost;
}

const PostForm = ({ post }: PostFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      iftar_type: "dine_in",
      max_guests: 0,
      gender: "men",
      hostDate: "",
    },
  });
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [, setPostData] = useState<IPost | null>(null);
  const { setValue } = form;

  useEffect(() => {
    const getUserData = async () => {
      setPostData(post);
      if (post) {
        setValue("address", post.address);
        setValue("iftar_type", post.iftar_type as "dine_in" | "take_out");
        setValue("max_guests", post.max_guests);
        // setValue("hostDate", post.host_date);
        setValue("gender", post.gender as "men" | "women" | "mixed");
      }
    };

    getUserData();
  }, [post, setValue]);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("gender", form.getValues().gender);
    formData.append("address", form.getValues().address);
    formData.append("iftar_type", form.getValues().iftar_type);
    formData.append("max_guests", form.getValues().max_guests.toString());
    formData.append("hostDate", form.getValues().hostDate);
    // console.log(form.getValues());
    startTransition(async () => {
      const { errorMessage } = await createPostAction(formData, post.id);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
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
            name="iftar_type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Dinner mode </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="dine_in" />
                      </FormControl>
                      <FormLabel className="font-normal">Dine in</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="take_out" />
                      </FormControl>
                      <FormLabel className="font-normal">Take out</FormLabel>
                    </FormItem>
                  </RadioGroup>
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
              <FormItem className="flex flex-col gap-1 mt-2">
                <FormLabel>
                  Changing hosting date for:{" "}
                  {new Date(post.host_date).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </FormLabel>
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(date);
                          setValue("hostDate", date ? date.toISOString() : "");
                        }}
                        autoFocus
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
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("gender", value as "men" | "women" | "mixed");
                    }}
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PostForm;
