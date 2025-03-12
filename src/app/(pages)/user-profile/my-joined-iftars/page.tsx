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
import Loader from "@/components/loader/loader";
import useFetchMyJoinedIftars from "@/hooks/fetch-user-joined-iftar";
import { IPost } from "@/hooks/use-fetch-posts";
import dayjs from "dayjs";
import Link from "next/link";

export default function MyPosts() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { posts, loading, error } = useFetchMyJoinedIftars();
  const [filteredPosts, setFilteredPosts] = useState<IPost[] | null>(null);

  useEffect(() => {
    if (posts && date) {
      const formattedDate = dayjs(date).format("MM-DD-YYYY"); // Format the selected date

      const filtered = posts.filter((post) => {
        const postDate = dayjs(post.host_date).format("MM-DD-YYYY"); // Assuming createdAt is in YYYY-MM-DD format
        return postDate === formattedDate;
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts); //show all posts if no date is selected.
    }
  }, [posts, date]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

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
            <Button>Host Iftar</Button>
          </Link>
        </div>

        {filteredPosts && filteredPosts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts?.map((offer) => (
              <IftarCard key={offer.id} offer={offer} />
            ))}
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
