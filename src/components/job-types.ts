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
