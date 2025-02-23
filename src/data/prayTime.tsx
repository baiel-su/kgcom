export default async function PrayerTimes() {
    const response = await fetch(
      "https://api.aladhan.com/v1/calendarByCity/2025/1?city=Houston&country=US&state=Texas&method=3&shafaq=general&tune=5%2C3%2C5%2C7%2C9%2C-1%2C0%2C8%2C-6&school=1&timezonestring=CT&calendarMethod=UAQ",
      {
        headers: {
          Accept: "application/json",
        },
        cache: "no-store", // Ensures fresh data on every request
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch prayer times");
    }
  
    const data = await response.json();
  
    return (
      <div>
        <h1 className="text-2xl font-bold">Prayer Times for Houston - January 2025</h1>
        <ul>
          {data.data.slice(0, 5).map((day: any, index: number) => (
            <li key={index} className="border p-2 my-2">
              <strong>Date:</strong> {day.date.gregorian.date} <br />
              <strong>Fajr:</strong> {day.timings.Fajr} <br />
              <strong>Dhuhr:</strong> {day.timings.Dhuhr} <br />
              <strong>Asr:</strong> {day.timings.Asr} <br />
              <strong>Maghrib:</strong> {day.timings.Maghrib} <br />
              <strong>Isha:</strong> {day.timings.Isha}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  