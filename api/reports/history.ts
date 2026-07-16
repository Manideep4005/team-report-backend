import type { VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { cors } from "../../lib/cors";
import { getISTTodayRange } from "../../lib/date";

export default async function handler(
  req: AuthRequest,
  res: VercelResponse
) {
  if (cors(req, res)) return;
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  if (!authenticate(req, res)) {
    return;
  }

  try {
    const date = req.query.date as string | undefined;

    const where: any = {
      userId: req.userId!,
    };

    if (date) {

      const { start, end } = getISTTodayRange();

      where.reportDate = {
        gte: start,
        lt: end,
      };
    }

    const reports = await prisma.workReport.findMany({
      where,
      orderBy: {
        reportDate: "desc",
      },
      select: {
        id: true,
        description: true,
        reportDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      data: reports,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}