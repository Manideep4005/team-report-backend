import { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma";
import { cors } from "../../lib/cors";
import { getISTTodayRange } from "../../lib/date";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (cors(req, res)) return;

  const { start, end } = getISTTodayRange();

  const reports = await prisma.workReport.findMany({
    where: {
      reportDate: {
        gte: start,
        lt: end,
      },
    },

    include: {
      user: {
        select: {
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });

  return res.json({
    success: true,
    data: reports,
  });
}