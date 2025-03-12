"use client";

import Loader from "@/components/loader/loader";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader/>
    </div>
  );
}
