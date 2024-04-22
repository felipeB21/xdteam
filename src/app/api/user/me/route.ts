import { COOKIE_NAME } from "@/consts";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json(
      { user: null, error: "No token found" },
      { status: 400 }
    );
  }

  const { value } = token;

  try {
    const decodedToken = verify(value, process.env.JWT_SECRET || "secret");

    if (
      !decodedToken ||
      typeof decodedToken !== "object" ||
      !decodedToken.username
    ) {
      throw new Error("Invalid token payload");
    }

    const { username } = decodedToken;

    return NextResponse.json({ user: username, error: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { user: null, error: "Invalid token" },
      { status: 400 }
    );
  }
}
