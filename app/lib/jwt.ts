import { SignJWT, jwtVerify, JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

// 👇 Function to sign a JWT
export async function signJWT(payload: JWTPayload, expiresIn: string = "1d") {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(expiresIn)
        .sign(SECRET);
}

// 👇 Function to verify a JWT
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload;
    } catch (err) {
        return null;
    }
}
