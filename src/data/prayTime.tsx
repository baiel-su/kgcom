"use client";

import { useEffect, useState } from "react";

export default function PrayerTimes() {
  interface PrayerTime {
    date: {
      gregorian: {
        date: string;
      };
    };
    timings: {
      Fajr: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
  }

  const [data, setData] = useState<PrayerTime[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const response = await fetch(
          "https://api.aladhan.com/v1/calendarByCity/2025/3?city=Houston&country=US&state=Texas&method=3&shafaq=general&tune=5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6&school=1&timezonestring=CT&calendarMethod=UAQ",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } 
    }

    fetchPrayerTimes();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold">
        Prayer Times for Houston - January 2025
      </h1>
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 my-2 w-full text-center">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Fajr</th>
              <th className="border border-gray-300 p-2">Dhuhr</th>
              <th className="border border-gray-300 p-2">Asr</th>
              <th className="border border-gray-300 p-2">Maghrib</th>
              <th className="border border-gray-300 p-2">Isha</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((day, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  {day.date.gregorian.date}
                </td>
                <td className="border border-gray-300 p-2">
                  {day.timings.Fajr}
                </td>
                <td className="border border-gray-300 p-2">
                  {day.timings.Dhuhr}
                </td>
                <td className="border border-gray-300 p-2">
                  {day.timings.Asr}
                </td>
                <td className="border border-gray-300 p-2">
                  {day.timings.Maghrib}
                </td>
                <td className="border border-gray-300 p-2">
                  {day.timings.Isha}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
