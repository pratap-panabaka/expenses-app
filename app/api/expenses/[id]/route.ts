import db from "@/app/lib/db";
import { jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

/* =======================
   Types
======================= */

type ExpenseRow = RowDataPacket & {
    amount: number;
    description: string;
};

type AuthPayload = JWTPayload & {
    id: number;
};

/* =======================
   Helpers
======================= */

const getUserIdFromToken = async (): Promise<number | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

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

/* =======================
   GET – Fetch single expense
======================= */

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.query<ExpenseRow[]>(
        "SELECT amount, description FROM expenses WHERE user_id = ? AND id = ? LIMIT 1",
        [userId, id]
    );

    if (rows.length === 0) {
        return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
};

/* =======================
   PATCH – Update expense
======================= */

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { desc?: unknown; amt?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { desc, amt } = body;

    if (typeof desc !== "string" || desc.trim() === "") {
        return NextResponse.json(
            { error: "Description is required" },
            { status: 400 }
        );
    }

    if (typeof amt !== "number" || amt < 0) {
        return NextResponse.json(
            { error: "Amount must be a positive number" },
            { status: 400 }
        );
    }

    const [result] = await db.execute<ResultSetHeader>(
        "UPDATE expenses SET description = ?, amount = ? WHERE user_id = ? AND id = ?",
        [desc, amt, userId, id]
    );

    if (result.affectedRows === 0) {
        return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200 });
};

/* =======================
   DELETE – Delete expense
======================= */

export const DELETE = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    const userId = await getUserIdFromToken();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [result] = await db.execute<ResultSetHeader>(
        "DELETE FROM expenses WHERE user_id = ? AND id = ?",
        [userId, id]
    );

    if (result.affectedRows === 0) {
        return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ status: 200 });
};
