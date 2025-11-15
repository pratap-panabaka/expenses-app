import db from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

type User = {
    id: number,
    email: string,
    password: string,
}

export const POST = async (req: Request) => {
    const { email, password } = await req.json();

    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const user = stmt.get(email) as User;

    try {
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return NextResponse.json({ error: "Invalid password" });
        }
    } catch (error) {
        return NextResponse.json({ error: "User is not registerd yet" });
    }

    const res = NextResponse.json({
        message: "User logged in successfully",
    });

    const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

    const payload = {
        email,
        id: user.id,
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

    res.cookies.set("token", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
    });

    return res;
}