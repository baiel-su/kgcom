// utils/convertTime.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const convertToCentralTime = (supabaseTimestamp: string) => {
  return dayjs.utc(supabaseTimestamp).tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss");
};
