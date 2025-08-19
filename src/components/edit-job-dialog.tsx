"use client";

import { useState } from "react";
import { Job } from "./job-types";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(2),
  company: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url(),
  salary: z.string().optional(),
  status: z.enum(["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]),
  notes: z.string().optional(),
});

interface EditJobDialogProps {
  job: Job;
  onJobUpdated: () => void;
}

export function EditJobDialog({ job, onJobUpdated }: EditJobDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(job);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return alert("Please fill in all required fields correctly.");

    setLoading(true);
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);
    if (!res.ok) return alert("Failed to update job");

    setOpen(false);
    onJobUpdated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="url">Job URL</Label>
            <Input id="url" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="salary">Salary (optional)</Label>
            <Input id="salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Job["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["SAVED","APPLIED","INTERVIEW","OFFER","REJECTED"] as const).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
