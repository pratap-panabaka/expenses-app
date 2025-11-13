import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";
import { SignJWT } from 'jose';

export const POST = async (req: Request) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");

  let id;
  try {
    const result = stmt.run(email, hashedPassword);
    id = result.lastInsertRowid;
  } catch (err: any) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    throw err;
  }

  const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

  const payload = {
    email,
    id,
  }

  const protectedHeader = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader(protectedHeader)
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(SECRET_KEY);

  console.log(jwt);

  const res = NextResponse.json({
    message: "User signed up successfully",
  });

  res.cookies.set("token", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 1,
    path: "/",
  });

  return res;
}
