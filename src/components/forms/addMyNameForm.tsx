import { addMyNameAction } from "@/actions/postActions";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  groupSize: z.coerce.number().min(1, "Guests quantity must be at least 1"),
});
type JoinPostFormProps = {
  postId: string;
};

export const AddMyNameForm = ({ postId }: JoinPostFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupSize: 0,
    },
  });
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    startTransition(async () => {
      const { success, message } = await addMyNameAction({
        postId,
        groupSize: form.getValues().groupSize,
      });
      if (success) {
        // temporary use
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        toast({
          title: "Success",
          description: "Successfully joined the post",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-4 p-2 my-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="groupSize"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Guests quantity</FormLabel>
                <FormControl>
                  <Input
                  className=""
                    type="number"
                    placeholder="Enter guests quantity"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.groupSize?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
