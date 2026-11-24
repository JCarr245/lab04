import { ChoreStatus } from "@/lib/types";

const STATUS_META: Record<
  ChoreStatus,
  { label: string; classes: string }
> = {
  open: {
    label: "Open",
    classes:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
  },
  in_progress: {
    label: "In Progress",
    classes:
      "bg-teal-100 text-teal-900 hover:bg-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:hover:bg-teal-900",
  },
  completed: {
    label: "Completed",
    classes:
      "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950 dark:text-green-200 dark:hover:bg-green-900",
  },
};

interface StatusPillProps {
  status: ChoreStatus;
  onClick: () => void;
  ariaLabel?: string;
}

/** One-tap status pill for cycling a chore between open, in_progress, and completed. */
export default function StatusPill({ status, onClick, ariaLabel }: StatusPillProps) {
  const meta = STATUS_META[status];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? `Status: ${meta.label}. Tap to change`}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${meta.classes}`}
    >
      {meta.label}
    </button>
  );
}
