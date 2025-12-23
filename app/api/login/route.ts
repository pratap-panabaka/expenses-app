import db from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

import type { RowDataPacket } from "mysql2";

type User = RowDataPacket & {
    id: number;
    email: string;
    password: string;
};

export const POST = async (req: Request) => {
    const { email, password } = await req.json();

    // mysql2 returns [rows, fields]
    const [rows] = await db.query<User[]>(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (rows.length === 0) {
        return NextResponse.json(
            { error: "User is not registered yet" },
            { status: 401 }
        );
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
        );
    }

    const res = NextResponse.json({
        message: "User logged in successfully",
    });

    const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

    const jwt = await new SignJWT({
        email: user.email,
        id: user.id,
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(SECRET_KEY);

    res.cookies.set("token", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    return res;
};
