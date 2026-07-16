import { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma";
import { cors } from "../../lib/cors";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {

  if (cors(req, res)) return;
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const reports = await prisma.workReport.findMany({
    where: {
      reportDate: today,
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