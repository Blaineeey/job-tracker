"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Job } from "./job-types";
import { Button } from "@/components/ui/button";

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Description:</strong> {job.description}</p>
          {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
          <p><strong>Status:</strong> {job.status}</p>
          {job.notes && <p><strong>Notes:</strong> {job.notes}</p>}
          <p>
            <strong>Link:</strong>{" "}
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Open Job Posting
            </a>
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
