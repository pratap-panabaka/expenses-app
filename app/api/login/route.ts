import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/app/lib/db";

type User = {
    id: number;
    email: string;
    password: string;
};

export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing email or password" },
                { status: 400 }
            );
        }

        // Get user by email
        const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
        const user = stmt.get(email) as User | undefined;

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Login successful
        return NextResponse.json({ message: "Login successful" });

    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
