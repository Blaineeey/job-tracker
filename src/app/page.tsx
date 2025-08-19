import { prisma } from "@/lib/prisma";
import { AddJobDialog } from "@/components/add-job-dialog";
import { JobTable } from "@/components/job-table";

export default async function Home() {
  const jobs = await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <AddJobDialog />
      </div>
      <JobTable initialJobs={jobs} />
    </main>
  );
}