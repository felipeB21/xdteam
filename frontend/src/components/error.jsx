import Link from "next/link";
import React from "react";
import ArrowLeft from "./icons/arrowLeft";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-[75dvh]">
      <h3 className="text-2xl font-bold">404</h3>
      <Link
        className="flex items-center gap-2 border border-neutral-600 bg-neutral-900 py-2 px-4 rounded mt-2 hover:bg-neutral-950"
        href={"/"}
      >
        <ArrowLeft /> Go Home
      </Link>
    </div>
  );
}
