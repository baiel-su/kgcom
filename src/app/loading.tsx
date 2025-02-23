"use client";

import { Loader2 } from "lucide-react"; // Example using lucide-react icons

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
    </div>
  );
}
