"use client";

import { DAY_NAMES, getNextAssigneeLabel } from "@/lib/logic";
import { Chore, DayOfWeek } from "@/lib/types";
import StatusPill from "./StatusPill";

interface ChoresTabProps {
  chores: Chore[];
  memberLabels: string[];
  weekNumber: number;
  garbageDay: DayOfWeek;
  onCycleChore: (choreId: string) => void;
  onAdvanceWeek: () => void;
  onChangeGarbageDay: (day: DayOfWeek) => void;
  onOpenAddChore: () => void;
}

/** Chores tab: weekly indoor/exterior rotation, garbage pickup day, and added household chores. */
export default function ChoresTab({
  chores,
  memberLabels,
  weekNumber,
  garbageDay,
  onCycleChore,
  onAdvanceWeek,
  onChangeGarbageDay,
  onOpenAddChore,
}: ChoresTabProps) {
  const weeklyChores = chores.filter((c) => c.isWeeklyRotation);
  const customChores = chores.filter((c) => !c.isWeeklyRotation);

  return (
    <section aria-label="Chores tab" className="space-y-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-[13px] font-bold">Weekly House &amp; Exterior</h2>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">
              Week {weekNumber} · Weekly reminders active
            </p>
          </div>
          <button
            type="button"
            onClick={onAdvanceWeek}
            className="rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-800 hover:bg-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Advance Week
          </button>
        </div>

        <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
          {weeklyChores.map((chore) => (
            <li
              key={chore.id}
              className="flex items-center justify-between gap-2 py-2 text-xs"
            >
              <div>
                <div className="font-semibold">{chore.title}</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  {chore.assignedToLabel} → Next:{" "}
                  {getNextAssigneeLabel(chore, memberLabels)}
                </div>
              </div>
              <StatusPill
                status={chore.status}
                onClick={() => onCycleChore(chore.id)}
                ariaLabel={`${chore.title}: ${chore.status}`}
              />
            </li>
          ))}
        </ul>

        <div className="mt-2.5 flex items-center justify-between border-t border-gray-200 pt-2.5 text-xs dark:border-slate-700">
          <label
            htmlFor="garbage-day-select"
            className="font-medium text-gray-700 dark:text-slate-300"
          >
            Garbage Pickup Day
          </label>
          <select
            id="garbage-day-select"
            value={garbageDay}
            onChange={(e) =>
              onChangeGarbageDay(Number(e.target.value) as DayOfWeek)
            }
            className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-semibold text-gray-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            {DAY_NAMES.map((dayName, idx) => (
              <option key={dayName} value={idx}>
                {dayName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {customChores.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-bold">Added Household Chores</h2>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">
              {customChores.length} total
            </span>
          </div>
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
            {customChores.map((chore) => (
              <li
                key={chore.id}
                className="flex items-center justify-between gap-2 py-2 text-xs"
              >
                <div>
                  <div className="font-semibold">{chore.title}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">
                    {chore.area} · {chore.assignedToLabel}
                  </div>
                </div>
                <StatusPill
                  status={chore.status}
                  onClick={() => onCycleChore(chore.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onOpenAddChore}
        className="w-full rounded-xl bg-teal-700 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300"
      >
        + Add Chore
      </button>
    </section>
  );
}
