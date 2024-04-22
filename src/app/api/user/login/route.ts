import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { COOKIE_NAME } from "@/consts";

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { user: null, error: "Invalid email or password" },
      { status: 400 }
    );
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { user: null, error: "Invalid email or password" },
      { status: 400 }
    );
  }

  const secret = process.env.JWT_SECRET || "secret";

  const token = sign(
    {
      userId: user.id,
      username: user.username,
    },
    secret,
    {
      expiresIn: MAX_AGE,
    }
  );

  const serialized = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    sameSite: "strict",
    path: "/",
  });
  return NextResponse.json(
    { user, error: null },
    { status: 200, headers: { "Set-Cookie": serialized } }
  );
}
