"use client";

import { useState } from "react";
import { ChoreArea } from "@/lib/types";

interface QuickAddModalProps {
  initialMode: "dish" | "chore";
  memberLabels: string[];
  activeMemberLabel: string;
  onClose: () => void;
  onAddDish: (description: string) => void;
  onAddChore: (title: string, area: ChoreArea, assignedToLabel: string) => void;
}

const AREA_OPTIONS: { value: ChoreArea; label: string }[] = [
  { value: "kitchen", label: "Kitchen & Fridge" },
  { value: "bathroom", label: "Bathroom" },
  { value: "living", label: "Living & Hallway" },
  { value: "exterior", label: "Porch & Exterior" },
  { value: "trash", label: "Trash & Recycling" },
];

/** Compact mobile modal for logging dirty dishes or adding a new chore in under 3 taps. */
export default function QuickAddModal({
  initialMode,
  memberLabels,
  activeMemberLabel,
  onClose,
  onAddDish,
  onAddChore,
}: QuickAddModalProps) {
  const [mode, setMode] = useState<"dish" | "chore">(initialMode);
  const [text, setText] = useState("");
  const [area, setArea] = useState<ChoreArea>("kitchen");
  const [assignee, setAssignee] = useState(activeMemberLabel);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (mode === "dish") {
      onAddDish(trimmed);
    } else {
      onAddChore(trimmed, area, assignee);
    }
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Quick add dish or chore"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
    >
      <div className="w-full max-w-[390px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setMode("dish")}
              className={
                mode === "dish"
                  ? "rounded-lg bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-900 dark:bg-teal-950 dark:text-teal-200"
                  : "rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300"
              }
            >
              Dirty Dishes
            </button>
            <button
              type="button"
              onClick={() => setMode("chore")}
              className={
                mode === "chore"
                  ? "rounded-lg bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-900 dark:bg-teal-950 dark:text-teal-200"
                  : "rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300"
              }
            >
              New Chore
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label
              htmlFor="quick-add-input"
              className="block text-xs font-semibold text-gray-700 dark:text-slate-200"
            >
              {mode === "dish" ? "What did you leave in the sink?" : "Chore title"}
            </label>
            <input
              id="quick-add-input"
              type="text"
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === "dish"
                  ? "e.g., Pasta pot & wooden spoon"
                  : "e.g., Wipe microwave & stove"
              }
              className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:border-teal-600 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {mode === "chore" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="chore-area"
                  className="block text-[11px] font-semibold text-gray-600 dark:text-slate-300"
                >
                  Area
                </label>
                <select
                  id="chore-area"
                  value={area}
                  onChange={(e) => setArea(e.target.value as ChoreArea)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  {AREA_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="chore-assignee"
                  className="block text-[11px] font-semibold text-gray-600 dark:text-slate-300"
                >
                  Assigned To
                </label>
                <select
                  id="chore-assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  {memberLabels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-2 text-xs font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          >
            {mode === "dish" ? "Save Dirty Dishes" : "Save Chore"}
          </button>
        </form>
      </div>
    </div>
  );
}
