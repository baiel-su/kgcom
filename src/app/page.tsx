"use client";

import PrayerTimes from "@/data/prayTime";

export default function Home() {
  return (
    <div>
      <h1>
        <PrayerTimes />
        <div className="px-4 py-8">
          <div className="flex items-center mb-5">
            <p className="text-base leading-6 cl">
              Web app is created to organize iftar dates for hosts and guests.
              It is still in beta version. Updates may apply during the month of
              Ramadan.
            </p>
          </div>
          <h3 className="text-lg mb-2">Instructions:</h3>
          <ul className="list-disc pl-5">
            <li className="mb-2">Go to Iftar page</li>
            <li className="mb-2">Click on the button to host an iftar</li>
            <li className="mb-2">Fill out the form and submit</li>
            <li className="mb-2">Go to Iftar page</li>
            <li className="mb-2">
              Click on the button `Add my name` to join an iftar
            </li>
            <li className="mb-2">Enter the group size and submit</li>
          </ul>
        </div>
      </h1>
    </div>
  );
}
