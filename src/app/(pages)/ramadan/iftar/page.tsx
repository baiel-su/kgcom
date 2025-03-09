"use client";


import { IftarCard } from "@/components/forms/iftarCard";
import FilterPosts from "@/components/post-components/filters";
import {
  FilterContextProvider,
  useFilterContext,
} from "@/contexts/filterContext";

export default function IftarFinderPage() {
  return (
    <FilterContextProvider>
      {" "}
      {/* Wrap the entire component here */}
      <IftarFinderContent />
    </FilterContextProvider>
  );
}
function IftarFinderContent() {
  const { filteredPosts } = useFilterContext();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold">Iftar Schedule</h1>
      <div className="py-10">
        <div className="flex gap-5 mb-8">
          <FilterPosts />
        </div>
        {filteredPosts && filteredPosts.length > 0 ? (
          <>
            {/* Render available posts first */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts
                .filter((offer) => {
                  const seatsLeft =
                    offer.max_guests -
                    offer.post_guests.reduce((a, c) => a + c.group_size, 0);
                  return seatsLeft > 0;
                })
                .map((offer) => {
                  const seatsLeft =
                    offer.max_guests -
                    offer.post_guests.reduce((a, c) => a + c.group_size, 0);
                  return (
                    <IftarCard
                      key={`${offer.id}-available`}
                      offer={offer}
                      seatsLeft={seatsLeft}
                    />
                  );
                })}
            </div>

            {/* Render fully booked posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredPosts
                .filter((offer) => {
                  const seatsLeft =
                    offer.max_guests -
                    offer.post_guests.reduce((a, c) => a + c.group_size, 0);
                  return seatsLeft === 0;
                })
                .map((offer) => (
                  <IftarCard
                    key={`${offer.id}-full`}
                    offer={offer}
                    seatsLeft={0}
                  />
                ))}
            </div>
          </>
        ) : (
          <p className="w-full p-2 bg-gray-200 dark:bg-slate-500 rounded-xl m-auto">
            No matches found
          </p>
        )}

        {/* <p className="text-center text-xl text-muted-foreground">
          No iftar offers available for this date. //{" "}
        </p> */}
      </div>
    </div>
  );
}
{
  /* <Popover>
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
            </Popover> */
}
