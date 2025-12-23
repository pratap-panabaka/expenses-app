import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";
import { SignJWT } from "jose";

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
    const [result]: any = await db.execute(
      "INSERT INTO users (email, pw) VALUES (?, ?)",
      [email, hashedPassword]
    );

    userId = result.insertId;
  } catch (err: any) {
    // MySQL duplicate key error
    if (err.code === "ER_DUP_ENTRY") {
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
