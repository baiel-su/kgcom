import { IPost } from "@/hooks/use-fetch-posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

export function IftarCard({
  offer,
  seatsLeft,
}: {
  offer: IPost;
  seatsLeft?: number;
}) {
  // const seatsLeft =
  //   offer.max_guests - offer.post_guests.reduce((a, c) => a + c.group_size, 0);

  const isFull = seatsLeft === 0;
  return (
    <Card
      className={isFull ? "bg-gray-200 pointer-events-none opacity-75" : ""}
    >
      <CardHeader>
        <CardTitle className="font-semibold">
          <p>
            Host: <span>{offer.user?.full_name}</span>
          </p>
        </CardTitle>
        <CardDescription>Address: {offer.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <div></div>
        <h3 className="mb-2">
          Guests invited: <span>{offer.max_guests}</span>
        </h3>
        <div className="flex justify-between items-center">
          <Link
            href={`/ramadan/post/${offer.id}`}
            as={`/ramadan/post/${offer.id}`}
          >
            <Button className="place-items-end" disabled={isFull}>
              See more
            </Button>
          </Link>
          {isFull ? (
            <h3 className="">Full</h3>
          ) : (
            <h3 className="">
              Open Seats: <span>{seatsLeft}</span>
            </h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
