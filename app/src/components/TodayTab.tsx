"use client";

import { useState } from "react";
import {
  DAY_NAMES,
  formatElapsed,
  getNextAssigneeLabel,
  isDishReminderActive,
} from "@/lib/logic";
import { Chore, DayOfWeek, DishEntry, HouseRule } from "@/lib/types";
import StatusPill from "./StatusPill";

interface TodayTabProps {
  dishes: DishEntry[];
  chores: Chore[];
  rules: HouseRule[];
  memberLabels: string[];
  activeMemberLabel: string;
  garbageDay: DayOfWeek;
  garbageDue: boolean;
  trashCompletedBy: string | null;
  nowMs: number;
  onClearDish: (dishId: string) => void;
  onMarkTrashDone: () => void;
  onCycleChore: (choreId: string) => void;
  onToggleRule: (ruleId: string) => void;
  onAddRule: (title: string, subtitle: string) => void;
  onOpenQuickAdd: (mode: "dish" | "chore") => void;
}

/** Focused Today view: garbage notice, sink dishes, user's weekly area, and daily house rules. */
export default function TodayTab({
  dishes,
  chores,
  rules,
  memberLabels,
  activeMemberLabel,
  garbageDay,
  garbageDue,
  trashCompletedBy,
  nowMs,
  onClearDish,
  onMarkTrashDone,
  onCycleChore,
  onToggleRule,
  onAddRule,
  onOpenQuickAdd,
}: TodayTabProps) {
  const [newRuleTitle, setNewRuleTitle] = useState("");

  const activeDishes = dishes.filter((d) => d.clearedAt === null);
  const overdueForUser = activeDishes.filter(
    (d) =>
      d.loggedByLabel === activeMemberLabel && isDishReminderActive(d, nowMs)
  );
  const weeklyChoresForUser = chores.filter(
    (c) => c.isWeeklyRotation && c.assignedToLabel === activeMemberLabel
  );
  const extraOpenChores = chores.filter(
    (c) => !c.isWeeklyRotation && c.status !== "completed"
  );
  const checkedRulesCount = rules.filter((r) => r.checked).length;

  function handleAddRuleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newRuleTitle.trim();
    if (!trimmed) return;
    onAddRule(trimmed, "House agreement");
    setNewRuleTitle("");
  }

  return (
    <section aria-label="Today tab" className="space-y-3">
      {garbageDue && !trashCompletedBy && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-amber-100 px-3 py-2.5 text-xs text-amber-900 dark:bg-amber-950/70 dark:text-amber-200">
          <span>
            <strong>Trash Tonight:</strong> Bins out before{" "}
            {DAY_NAMES[garbageDay]} morning pickup.
          </span>
          <button
            type="button"
            onClick={onMarkTrashDone}
            className="shrink-0 rounded-lg border border-amber-300 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-amber-900 hover:bg-white dark:border-amber-700 dark:bg-slate-800 dark:text-amber-100"
          >
            Done
          </button>
        </div>
      )}

      {garbageDue && trashCompletedBy && (
        <div className="rounded-xl bg-green-100 px-3 py-2 text-xs text-green-900 dark:bg-green-950/60 dark:text-green-200">
          <strong>Trash Taken Out:</strong> Marked done by {trashCompletedBy}.
        </div>
      )}

      {overdueForUser.length > 0 && (
        <div className="rounded-xl bg-amber-100 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/70 dark:text-amber-200">
          <strong>Daytime Dish Reminder:</strong> You have{" "}
          {overdueForUser.length} uncleaned dish{" "}
          {overdueForUser.length === 1 ? "entry" : "entries"} past 2 hours.
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold">Dirty Dishes in Sink</h2>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            {activeDishes.length} active
          </span>
        </div>

        {activeDishes.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            Sink is clear — no dirty dishes right now.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
            {activeDishes.map((dish) => {
              const reminded = isDishReminderActive(dish, nowMs);
              return (
                <li
                  key={dish.id}
                  className="flex items-center justify-between gap-2 py-2 text-xs"
                >
                  <div>
                    <div className="font-semibold">{dish.description}</div>
                    <div className="text-[11px] text-gray-500 dark:text-slate-400">
                      {dish.loggedByLabel} · {formatElapsed(dish.createdAt, nowMs)}
                      {reminded ? " · Reminder sent" : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onClearDish(dish.id)}
                    aria-label={`Clear ${dish.description}`}
                    className="shrink-0 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-800 hover:bg-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  >
                    Clear
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold">Your Weekly Area</h2>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            {activeMemberLabel}
          </span>
        </div>

        {weeklyChoresForUser.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            No weekly area assigned to {activeMemberLabel} this week.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
            {weeklyChoresForUser.map((chore) => (
              <li
                key={chore.id}
                className="flex items-center justify-between gap-2 py-2 text-xs"
              >
                <div>
                  <div className="font-semibold">{chore.title}</div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">
                    Rotates next to {getNextAssigneeLabel(chore, memberLabels)}
                  </div>
                </div>
                <StatusPill
                  status={chore.status}
                  onClick={() => onCycleChore(chore.id)}
                  ariaLabel={`${chore.title}: ${chore.status}. Tap to switch status`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {extraOpenChores.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-bold">Other Open Chores</h2>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">
              {extraOpenChores.length} open
            </span>
          </div>
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
            {extraOpenChores.map((chore) => (
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

      {/* Daily House Rules & Night Check moved to Today */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold">House Rules &amp; Night Check</h2>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            {checkedRulesCount}/{rules.length} checked
          </span>
        </div>

        <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="flex items-center justify-between gap-2 py-2 text-xs"
            >
              <div>
                <div className="font-semibold">{rule.title}</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  {rule.subtitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleRule(rule.id)}
                aria-label={`${rule.title}: ${rule.checked ? "Checked" : "Pending"}`}
                className={
                  rule.checked
                    ? "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800 dark:bg-green-950 dark:text-green-200"
                    : "shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-slate-700 dark:text-slate-200"
                }
              >
                {rule.checked ? "Checked" : "Pending"}
              </button>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleAddRuleSubmit}
          className="mt-2.5 flex gap-1.5 border-t border-gray-200 pt-2.5 dark:border-slate-700"
        >
          <input
            type="text"
            aria-label="New house rule"
            value={newRuleTitle}
            onChange={(e) => setNewRuleTitle(e.target.value)}
            placeholder="Add a daily rule..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-teal-700 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          >
            Add
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={() => onOpenQuickAdd("dish")}
        className="w-full rounded-xl bg-teal-700 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300"
      >
        + Log Dirty Dishes or Chore
      </button>
    </section>
  );
}
