import React from "react";
import PostUbiUser from "@/components/forms/postUbiUser";

export default function page() {
  return (
    <div>
      <div className="absolute inset-0 -z-10 h-[70dvh] w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_40%,#1dc384_10%,#bfde55_100%)] rounded-b-3xl"></div>
      <PostUbiUser />
    </div>
  );
}
