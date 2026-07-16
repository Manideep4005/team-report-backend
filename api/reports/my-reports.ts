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

  if (!authenticate(req, res)) {
    return;
  }

  try {
    const userId = req.userId!;

    const { start, end } = getISTTodayRange();

    const report = await prisma.workReport.findFirst({
      where: {
        userId: userId,
        reportDate: {
          gte: start,
          lt: end,
        },
      },
    });

    res.json({
      success: true,
      data: report,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
}