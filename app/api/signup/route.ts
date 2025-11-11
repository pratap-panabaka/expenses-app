import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";

export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing email or password" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");

        try {
            stmt.run(email, hashedPassword);
        } catch (err: any) {
            if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            }
        }

        return NextResponse.json({ message: "User signed up successfully" });

    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
