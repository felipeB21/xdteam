import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const maxUsers = 5;

  const users = await db.user.findMany({
    take: maxUsers,
  });

  return NextResponse.json({ users }, { status: 200 });
}
