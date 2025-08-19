"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  salary?: string | null;
  url: string;
  status: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function JobTable({ initialJobs }: { initialJobs: Job[] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  function statusBadge(s: Job["status"]) {
    const map: Record<Job["status"], string> = {
      SAVED: "bg-gray-200",
      APPLIED: "bg-blue-200",
      INTERVIEW: "bg-yellow-200",
      OFFER: "bg-green-200",
      REJECTED: "bg-red-200",
    };
    return <Badge className={map[s]}>{s}</Badge>;
  }

  async function updateStatus(id: string, status: Job["status"]) {
    const res = await fetch(`/api/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!res.ok) return alert("Failed to update status");
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) return alert("Failed to delete");
    setJobs((prev) => prev.filter((j) => j.id !== id));
    router.refresh();
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Salary</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((j) => (
          <TableRow key={j.id}>
            <TableCell>
              <a className="font-medium underline" href={j.url} target="_blank" rel="noreferrer">{j.title}</a>
              <div className="line-clamp-2 text-sm text-muted-foreground">{j.description}</div>
            </TableCell>
            <TableCell>{j.company}</TableCell>
            <TableCell className="space-x-2">
              {statusBadge(j.status)}
              <Select value={j.status} onValueChange={(v) => updateStatus(j.id, v as Job["status"]) }>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["SAVED","APPLIED","INTERVIEW","OFFER","REJECTED"] as const).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>{j.salary ?? "—"}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => window.open(j.url, "_blank")}>Open</Button>
                <Button variant="destructive" onClick={() => remove(j.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}