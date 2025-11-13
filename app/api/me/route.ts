import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || '';

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        maxTokenAge: '1d',
    });

    return NextResponse.json(payload);
}
