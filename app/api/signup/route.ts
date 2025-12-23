import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";
import { SignJWT } from "jose";
import type { ResultSetHeader } from "mysql2";

export const POST = async (req: Request) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let userId: number;

  try {
    // Use ResultSetHeader instead of any
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (email, pw) VALUES (?, ?)",
      [email, hashedPassword]
    );

    userId = result.insertId;
  } catch (err: unknown) {
    // Type-safe error handling
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }

  const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

  const payload = {
    email,
    id: userId,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(SECRET_KEY);

  const res = NextResponse.json({
    message: "User signed up successfully",
  });

  res.cookies.set("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return res;
};
