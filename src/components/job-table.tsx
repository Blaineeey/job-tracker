"use client";

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

import { Job } from "./job-types"; // Create a separate Job type file if you like
import { EditJobDialog } from "./edit-job-dialog";
import { JobDetailModal } from "./job-detail-modal";

interface JobTableProps {
  jobs?: Job[];
  refreshJobs: () => void;
}

const statusColors: Record<Job["status"], string> = {
  SAVED: "bg-gray-300 text-gray-800",
  APPLIED: "bg-blue-300 text-blue-800",
  INTERVIEW: "bg-yellow-300 text-yellow-800",
  OFFER: "bg-green-300 text-green-800",
  REJECTED: "bg-red-300 text-red-800",
};

export function JobTable({ jobs = [], refreshJobs }: JobTableProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this job?")) return;
    setUpdatingId(id);
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setUpdatingId(null);
    refreshJobs();
  }

  async function handleStatusChange(id: string, status: Job["status"]) {
    setUpdatingId(id);
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    refreshJobs();
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <Button variant="link" onClick={() => setSelectedJob(job)}>
                  {job.title}
                </Button>
              </TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>
                <Badge className={statusColors[job.status]}>
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <EditJobDialog job={job} onJobUpdated={refreshJobs} />
                <Button disabled={updatingId === job.id} onClick={() => handleDelete(job.id)}>Delete</Button>
                <Button asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">Go</a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedJob && (
        <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}
