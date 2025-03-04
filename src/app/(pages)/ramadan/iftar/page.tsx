"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { IftarCard } from "@/components/forms/iftarCard";
import useFetchPosts, { IPost } from "@/hooks/use-fetch-posts";
import dayjs from "dayjs";
import Link from "next/link";

export default function IftarFinderPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { posts, error } = useFetchPosts();
  const [filteredPosts, setFilteredPosts] = useState<IPost[] | null>(null);

  useEffect(() => {
    if (posts && date) {
      const formattedDate = dayjs(date).format("MM-DD-YYYY"); // Format the selected date

      const filtered = posts
        .filter((post) => {
          const postDate = dayjs(post.host_date).format("MM-DD-YYYY"); // Assuming createdAt is in YYYY-MM-DD format
          return postDate === formattedDate;
        })
        .sort(
          (a, b) =>
            new Date(a.host_date).getTime() - new Date(b.host_date).getTime()
        ); // Sort by host_date ascending
      setFilteredPosts(filtered);
    } else {
      const sortedPosts = (posts ?? []).sort(
        (a, b) =>
          new Date(a.host_date).getTime() - new Date(b.host_date).getTime()
      ); // Sort all posts by host_date ascending
      setFilteredPosts(sortedPosts);
    }
  }, [posts, date]);

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold">Iftar Schedule</h1>
      <div className="py-10">
        <div className="flex gap-5 mb-8">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
          <Link href="/ramadan/post/create-post">
            <Button>Host an Iftar</Button>
          </Link>
        </div>

        {filteredPosts && filteredPosts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts?.map((offer) => {
              const seatsLeft =
                offer.max_guests -
                offer.post_guests.reduce((a, c) => a + c.group_size, 0);
              return (
                <IftarCard key={offer.id} offer={offer} seatsLeft={seatsLeft} />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-xl text-muted-foreground">
            No iftar offers available for this date.
          </p>
        )}
      </div>
    </div>
  );
}
