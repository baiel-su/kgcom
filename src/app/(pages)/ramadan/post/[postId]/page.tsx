// app/ramadan/post/[id]/PostClient.tsx

"use client";

import { addMyNameAction } from "@/actions/postActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFetchPost } from "@/hooks/use-fetch-single-post";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";


export default function PostClient() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupSize: 0,
    },
  });
  const { postId } = useParams<{ postId: string }>();
  const { post, error } = useFetchPost(postId as string | undefined);
  // console.log(postId)

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto font-sans">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">
            Host: {post.user.full_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-gray-700">
            <label className="font-semibold">Gender: </label>
            <span></span>
            {post.gender}
          </p>
          <p className="text-gray-700">
            <label className="font-semibold">Address: </label>
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                post.address
              )}`}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.address}
            </Link>
          </p>
          <p className="text-gray-700">
            <label className="font-semibold">Number of guests invited: </label>
            <span>{post.max_guests}</span>
          </p>
          <p>
            <label className="font-semibold">Hosting Date: </label>
            <span>{dayjs(post.host_date).format("MM-DD-YYYY")}</span>
          </p>
          <p className="text-gray-700">
            <label className="font-semibold">Phone: </label>
            <Link
              href={`https://wa.me/+1${post.user.phone}`}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              +1{post.user.phone}
            </Link>
          </p>
          {post.post_guests.length > 0 &&
            post.post_guests.map((guest, index) => (
              <div key={index} className="py-2">
                <p className="text-gray-700">
                  <label className="font-semibold">Guest {index + 1}: </label>
                  <span>{guest.user.full_name}</span>
                </p>
                <p className="text-gray-700">
                  <label className="font-semibold">Group {index + 1}: </label>
                  <span>{guest.group_size} guest(s)</span>
                </p>
                <p>
                  <label className="font-semibold">Guest: </label>
                  <Link
                    href={`https://wa.me/+1${guest.user.phone}`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +1{guest.user.phone}
                  </Link>
                </p>
              </div>
            ))}

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="groupSize"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                      {form.formState.errors.groupSize?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

const formSchema = z.object({
  groupSize: z.coerce.number().min(1, "Guests quantity must be at least 1"),
});
