import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";
import { signJWT } from "@/app/lib/jwt";

type User = {
    id: number;
    email: string;
    password: string;
};

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

        // ✅ Get user by email
        const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
        const user = stmt.get(email) as User | undefined;

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // ✅ Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // ✅ Generate JWT (async!)
        const token = await signJWT({ email: user.email });

        // ✅ Create response
        const res = NextResponse.json({
            message: "User logged in successfully",
        });

        // ✅ Set secure, HTTP-only cookie
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/", // Make cookie available app-wide
            maxAge: 60 * 60 * 24, // 1 day
        });

        return res;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};
