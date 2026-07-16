import type { VercelRequest, VercelResponse } from "@vercel/node";

export function cors(req: VercelRequest, res: VercelResponse) {
    const origin = process.env.FRONTEND_URL!;

    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return true;
    }

    return false;
}