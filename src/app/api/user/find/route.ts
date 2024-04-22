import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const findByUsername = await db.user.findMany({
    select: {
      username: true,
    },
  });

  if (!findByUsername) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: findByUsername }, { status: 200 });
}
