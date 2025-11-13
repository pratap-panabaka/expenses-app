import { NextResponse } from "next/server";

export const POST = async () => {
    const res = NextResponse.json({ message: "Logged out" });

    res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return res;
};
