import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(1),
  description: z.string().min(1),
  salary: z.string().optional().nullable(),
  url: z.string().url(),
  status: z
    .enum(["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"])
    .optional(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const jobs = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const job = await prisma.jobApplication.create({
    data: { ...parsed.data, status: parsed.data.status ?? "SAVED" },
  });
  return NextResponse.json(job, { status: 201 });
}