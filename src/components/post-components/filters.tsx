"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFilterContext } from "@/contexts/filterContext";
import { useMediaQuery } from "@/lib/mediaQuery";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const formSchema = z.object({
  iftar_type: z.enum(["dine_in", "take_out",""]),
  gender: z.enum(["men", "women", "mixed",""]),
  hostDate: z.date().nullable(),
});

const FilterPosts = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      iftar_type: "",
      gender: "",
      hostDate: null,
    },
  });

  console.log("form", form.getValues());

  const { setFilters } = useFilterContext();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setFilters({
      ...data,
      hostDate: data.hostDate ?? null,
    });
    setIsSheetOpen(false); // Close sheet on submit
  };

  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setIsSheetOpen(true)}>
          <Filter /> Filter
        </Button>
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>Choose options to filter the posts</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Hosting Date */}
              <div className="space-y-2">
                <div className="p-2 border rounded-md border-border bg-muted/50 space-y-2">
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
                                  !form.watch("hostDate") &&
                                    "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {form.watch("hostDate") ? (
                                  form.watch("hostDate") ? format(form.watch("hostDate") as Date, "PPP") : ""
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Iftar Type */}
                <div className="p-2 border rounded-md border-border bg-muted/50 space-y-2">
                  <FormField
                    control={form.control}
                    name="iftar_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Iftar mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center jus space-x-3">
                              <FormControl>
                                <RadioGroupItem value="dine_in" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Dine in
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="take_out" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Take out
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender */}
                <div className="p-2 border rounded-md border-border bg-muted/50 space-y-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="men" />
                              </FormControl>
                              <FormLabel className="font-normal">Men</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="women" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Women
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="mixed" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Mixed
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterPosts;


