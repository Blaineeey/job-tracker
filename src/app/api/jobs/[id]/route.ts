import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  company: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  salary: z.string().optional().nullable(),
  url: z.string().url().optional(),
  status: z.enum(["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
  notes: z.string().optional().nullable(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const job = await prisma.jobApplication.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(job);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.jobApplication.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}