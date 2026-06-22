import type { GroupType, LeadStatus } from "@/types/database";

export const LEAD_STATUSES: Array<{ value: LeadStatus; label: string }> = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "VIBE_CHECK", label: "Vibe check" },
  { value: "SENT", label: "Sent" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "NOT_A_FIT", label: "Not a fit" },
];

export const GROUP_TYPES: Array<{ value: GroupType; label: string }> = [
  { value: "solo", label: "Solo" },
  { value: "friends", label: "Friends" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
];

export const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-sand/25 text-olive",
  CONTACTED: "bg-blue-100 text-blue-800",
  QUALIFIED: "bg-emerald-100 text-emerald-800",
  VIBE_CHECK: "bg-violet-100 text-violet-800",
  SENT: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-rust text-white",
  NOT_A_FIT: "bg-ink text-white",
};
