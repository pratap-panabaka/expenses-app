import db from "@/app/lib/db";
import { jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/* =======================
   Types
======================= */

type ExpenseRow = RowDataPacket & {
    id: number;
    user_id: number;
    description: string;
    amount: number;
};

type AuthPayload = JWTPayload & {
    id: number;
};

/* =======================
   Helper – get userId from JWT
======================= */

const getUserIdFromToken = async (): Promise<number | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify<AuthPayload>(token, secret, {
            algorithms: ["HS256"],
            maxTokenAge: "1d",
        });

        if (typeof payload.id !== "number") return null;
        return payload.id;
    } catch {
        return null;
    }
};

/* ===================== GET ===================== */

export const GET = async () => {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [rows] = await db.execute<ExpenseRow[]>(
            "SELECT * FROM expenses WHERE user_id = ?",
            [userId]
        );
        return NextResponse.json(rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch expenses" },
            { status: 500 }
        );
    }
};

/* ===================== POST ===================== */

export const POST = async (req: Request) => {
    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { description?: unknown; amount?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { description, amount } = body;

    if (typeof description !== "string" || description.trim() === "") {
        return NextResponse.json(
            { error: "Description is required" },
            { status: 400 }
        );
    }

    if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
            { error: "Amount must be a positive number" },
            { status: 400 }
        );
    }

    try {
        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO expenses (user_id, description, amount) VALUES (?, ?, ?)",
            [userId, description, amount]
        );

        const expenseId = result.insertId;

        const [rows] = await db.execute<ExpenseRow[]>(
            "SELECT * FROM expenses WHERE id = ?",
            [expenseId]
        );

        return NextResponse.json(rows[0], { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to create expense" },
            { status: 500 }
        );
    }
};
