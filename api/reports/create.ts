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
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
    });
  }

  if (!authenticate(req, res)) {
    return;
  }

  try {
    const { description } = req.body;
    const userId = req.userId!;

    const { start, end } = getISTTodayRange();

    const existingReport = await prisma.workReport.findFirst({
      where: {
        userId: userId,
        reportDate: {
          gte: start,
          lt: end,
        },
      },
    });

    let report;

    if (existingReport) {
      report = await prisma.workReport.update({
        where: {
          id: existingReport.id,
        },
        data: {
          description,
        },
      });
    } else {
      report = await prisma.workReport.create({
        data: {
          userId: userId,
          description,
          reportDate: start,
        },
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}