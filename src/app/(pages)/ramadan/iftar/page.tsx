"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { PostFormContent } from "../post/form";
import useFetchPosts, { Post } from "@/hooks/use-fetch-posts";
import { convertToCentralTime } from "@/lib/convertTime";
import dayjs from "dayjs";

export default function IftarFinderPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { posts, error, loading } = useFetchPosts();
  const [filteredPosts, setFilteredPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (posts && date) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format the selected date

      const filtered = posts.filter((post) => {
        const postDate = dayjs(post.createdAt).format('YYYY-MM-DD'); // Assuming createdAt is in YYYY-MM-DD format
        return postDate === formattedDate;
      });
      setFilteredPosts(filtered);
    } else {
        setFilteredPosts(posts); //show all posts if no date is selected.
    }
  }, [posts, date]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mx-auto py-10">
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
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <PostFormContent />
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

function IftarCard({ offer }: { offer: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">
          <p>
            Host: <span>{offer.user.full_name}</span>
          </p>
        </CardTitle>
        <CardDescription>Address: {offer.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="mb-2">
          Phone: <span>{offer.user.phone}</span>
        </h3>
        <h3 className="mb-2">
          Gender: <span>{offer.gender}</span>
        </h3>
        <Button className="place-items-end">Add my name</Button>

        {/* <h3 className="font-semibold mb-2">Guests:</h3>
        <ul className="list-disc list-inside">
          {offer?.users?.map((user: string, index: number) => (
            <li key={index}>{user}</li>
          ))}
        </ul> */}
      </CardContent>
    </Card>
  );
}
