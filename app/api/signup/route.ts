import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";
import { signJWT } from "@/app/lib/jwt";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    // ✅ Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert into database
    const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");

    try {
      stmt.run(email, hashedPassword);
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
      throw err; // other DB errors
    }

    // ✅ Sign JWT (must await since jose uses async)
    const token = await signJWT({ email });

    // ✅ Create response & set secure cookie
    const res = NextResponse.json({
      message: "User signed up successfully",
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
      path: "/", // ensures it's available site-wide
    });

    return res;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
