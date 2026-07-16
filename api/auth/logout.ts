import type { VercelRequest, VercelResponse } from "@vercel/node";
import { cors } from "../../lib/cors";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (cors(req, res)) return;
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed",
        });
    }

    res.setHeader(
        "Set-Cookie",
        "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
    );

    return res.json({
        success: true,
    });
}