"use client";

import { useEffect, useState } from "react";
import { AddJobDialog } from "@/components/add-job-dialog";
import { JobTable, Job } from "@/components/job-table";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data: Job[] = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <AddJobDialog onJobAdded={fetchJobs} />
      </div>

      {loading ? (
        <p>Loading jobs…</p>
      ) : (
        <JobTable jobs={jobs} refreshJobs={fetchJobs} />
      )}
    </main>
  );
}
