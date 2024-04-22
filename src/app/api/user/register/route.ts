import { serialize } from "cookie";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";
import { sign } from "jsonwebtoken";
import { COOKIE_NAME } from "@/consts";

const MAX_AGE = 60 * 60 * 24 * 30;

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = userSchema.parse(body);

    const findUserEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (findUserEmail) {
      return NextResponse.json(
        { user: null, error: "User email already exists" },
        { status: 400 }
      );
    }

    const findUserName = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (findUserName) {
      return NextResponse.json(
        { user: null, error: "Username already exists" },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { user: null, error: "Oops, Something went wrong" },
      { status: 500 }
    );
  }
}
