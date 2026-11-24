"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/logic";
import { RepairIssue, RepairStatus } from "@/lib/types";

const REPAIR_OPTIONS: { value: RepairStatus; label: string; activeClasses: string }[] = [
  {
    value: "reported",
    label: "Reported",
    activeClasses:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700",
  },
  {
    value: "fixed",
    label: "Fixed",
    activeClasses:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-700",
  },
];

interface RepairsTabProps {
  repairs: RepairIssue[];
  simulatedHoursOffset: number;
  forceGarbageEve: boolean;
  onSetRepairStatus: (repairId: string, status: RepairStatus) => void;
  onAddRepair: (title: string, location: string) => void;
  onToggleSimulatedHours: () => void;
  onToggleForceGarbageEve: () => void;
  onResetSampleData: () => void;
}

function RepairStatusPicker({
  repair,
  onSelect,
}: {
  repair: RepairIssue;
  onSelect: (status: RepairStatus) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Status for ${repair.title}`}
      className="mt-2 grid grid-cols-2 gap-1.5"
    >
      {REPAIR_OPTIONS.map((opt) => {
        const isActive = repair.status === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(opt.value)}
            className={
              isActive
                ? `rounded-lg border py-1 text-[11px] font-semibold ${opt.activeClasses}`
                : "rounded-lg border border-gray-200 bg-gray-50 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700"
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Repairs tab: active landlord issues with reported date/time, Reported/Fixed status picker, and issue history. */
export default function RepairsTab({
  repairs,
  simulatedHoursOffset,
  forceGarbageEve,
  onSetRepairStatus,
  onAddRepair,
  onToggleSimulatedHours,
  onToggleForceGarbageEve,
  onResetSampleData,
}: RepairsTabProps) {
  const [showAddRepair, setShowAddRepair] = useState(false);
  const [repairTitle, setRepairTitle] = useState("");
  const [repairLocation, setRepairLocation] = useState("");

  const activeRepairs = repairs.filter((r) => r.status !== "fixed");
  const historyRepairs = repairs.filter((r) => r.status === "fixed");

  function handleRepairSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = repairTitle.trim();
    if (!trimmed) return;
    onAddRepair(trimmed, repairLocation.trim() || "Common Area");
    setRepairTitle("");
    setRepairLocation("");
    setShowAddRepair(false);
  }

  return (
    <section aria-label="Repairs tab" className="space-y-3">
      {/* Active Reported & In Progress Issues */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[13px] font-bold">Repairs &amp; Landlord Log</h2>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">
              Active maintenance requests
            </p>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            {activeRepairs.length} active
          </span>
        </div>

        {activeRepairs.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            No active repair issues right now.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
            {activeRepairs.map((repair) => (
              <li key={repair.id} className="py-2.5 text-xs">
                <div className="font-semibold">{repair.title}</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  {repair.location} · By {repair.loggedByLabel}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  Reported {formatDateTime(repair.reportedAt)}
                </div>
                <RepairStatusPicker
                  repair={repair}
                  onSelect={(status) => onSetRepairStatus(repair.id, status)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {showAddRepair ? (
        <form
          onSubmit={handleRepairSubmit}
          className="space-y-2.5 rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold">Report Maintenance Issue</h3>
            <button
              type="button"
              onClick={() => setShowAddRepair(false)}
              className="text-[11px] text-gray-500 dark:text-slate-400"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            aria-label="Repair issue title"
            value={repairTitle}
            onChange={(e) => setRepairTitle(e.target.value)}
            placeholder="e.g., Hallway closet hinge loose"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            type="text"
            aria-label="Repair location"
            value={repairLocation}
            onChange={(e) => setRepairLocation(e.target.value)}
            placeholder="Room / Location (e.g., Kitchen)"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-2 text-xs font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          >
            Save Issue
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddRepair(true)}
          className="w-full rounded-xl bg-teal-700 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300"
        >
          + Report Repair Issue
        </button>
      )}

      {/* Issue History */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold">Issue History</h2>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            {historyRepairs.length} fixed
          </span>
        </div>

        {historyRepairs.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            Fixed issues will appear here for reference.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
            {historyRepairs.map((repair) => (
              <li key={repair.id} className="py-2.5 text-xs">
                <div className="font-semibold">{repair.title}</div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  {repair.location} · By {repair.loggedByLabel}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400">
                  Reported {formatDateTime(repair.reportedAt)}
                  {repair.fixedAt ? ` · Fixed ${formatDateTime(repair.fixedAt)}` : ""}
                </div>
                <RepairStatusPicker
                  repair={repair}
                  onSelect={(status) => onSetRepairStatus(repair.id, status)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Demo / Reminder Preview Controls for v1 browser testing */}
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-[13px] font-bold">Reminder Preview Controls</h2>
        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-slate-400">
          Test time-based reminders immediately in v1 without waiting.
        </p>

        <div className="mt-2.5 space-y-2">
          <button
            type="button"
            onClick={onToggleSimulatedHours}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            <span>Fast-forward dish timer (+3h)</span>
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {simulatedHoursOffset > 0 ? "ON (+3h)" : "OFF"}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleForceGarbageEve}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
          >
            <span>Preview Trash Night reminder</span>
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {forceGarbageEve ? "ON" : "OFF"}
            </span>
          </button>

          <button
            type="button"
            onClick={onResetSampleData}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Reset Sample Data
          </button>
        </div>
      </div>
    </section>
  );
}
