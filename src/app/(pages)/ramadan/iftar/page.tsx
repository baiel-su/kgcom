"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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

import { IftarOffer, iftarOffers } from "./mockdata";
import Link from "next/link";
import { ResponsiveForm } from "../post/form";
import { createClient } from "../../../../../supabase/config/supabaseClient";

export default function IftarFinderPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const filteredOffers = iftarOffers.filter(
    (offer) => offer.date === format(date || new Date(), "yyyy-MM-dd")
  );

  console.log(createClient)

  return (
    <div className=" container mx-auto py-10">
      {/*  
      <div className="py-10 flex justify-between mb-8">
        <div className="flex flex-col gap-10 justify-center items-start w-1/2 ">
          <h1 className="text-4xl font-bold text-center">Iftar Finder</h1>
          <p className="text-lg text-muted-foreground">
            Wishing you a blessed and peaceful Ramadan!
            <br /> May this holy month bring you and your loved ones joy,
            prosperity, and spiritual growth.{" "}
          </p>
          <Button
            className={cn("mt-4", date ? "bg-primary" : "bg-muted-foreground")}
          >
            Invite guests
          </Button>
        </div>
        <div className="">
          <img src="/pngegg.png" alt="Food" className="w-52  " />
        </div>
      </div>*/}
      <h1 className="text-4xl font-bold ">Iftar Schedule</h1>
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
          <ResponsiveForm />
        </div>

        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
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

function IftarCard({ offer }: { offer: IftarOffer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{offer.hostName}</CardTitle>
        <CardDescription>{offer.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">Menu:</h3>
        <ul className="list-disc list-inside">
          {offer.menu.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
