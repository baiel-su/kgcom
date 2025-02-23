"use client";

import PrayerTimes from "@/data/prayTime";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div>
      <h1>
        <PrayerTimes />
      </h1>
    </div>
  );
}
