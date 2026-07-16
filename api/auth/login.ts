import prisma from "../../lib/prisma";

import bcrypt from "bcryptjs";

import { generateToken } from "../../lib/jwt";
import { cors } from "../../lib/cors";

export default async function handler(

    req: any,

    res: any

) {
    if (cors(req, res)) return;

    if (req.method !== "POST") {

        return res.status(405).end();

    }

    const {

        email,

        password,

    } = req.body;



    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    console.log("Email:", email);
    console.log("User Found:", !!user);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found",
        });
    }

    const ok = await bcrypt.compare(
        password,
        user.password
    );

    console.log("Password Match:", ok);

    if (!ok) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        });
    }

    const token = generateToken(user.id);

    res.setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=604800`
    );

    return res.json({

        success: true,

        user: {

            id: user.id,

            name: user.name,

            email: user.email,

        },

    });

}