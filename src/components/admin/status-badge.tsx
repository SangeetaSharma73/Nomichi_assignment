import { LEAD_STATUSES, STATUS_STYLES } from "@/lib/constants";
import type { LeadStatus } from "@/types/database";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const label = LEAD_STATUSES.find((item) => item.value === status)?.label ?? status;
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}
