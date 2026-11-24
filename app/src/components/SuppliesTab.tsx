"use client";

import { useState } from "react";
import { SupplyItem, SupplyStatus } from "@/lib/types";

const SUPPLY_STATUS_META: Record<
  SupplyStatus,
  { label: string; badgeClasses: string }
> = {
  stocked: {
    label: "Stocked",
    badgeClasses:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  },
  low: {
    label: "Low",
    badgeClasses:
      "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  out: {
    label: "Out",
    badgeClasses:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  },
};

const SUPPLY_CYCLE: Record<SupplyStatus, SupplyStatus> = {
  stocked: "low",
  low: "out",
  out: "stocked",
};

interface SuppliesTabProps {
  supplies: SupplyItem[];
  onSetSupplyStatus: (supplyId: string, nextStatus: SupplyStatus) => void;
  onAddSupply: (name: string, status: SupplyStatus, note: string) => void;
}

/** Supplies tab: view household consumables, flag low/out, mark restocked in 1 tap, or add items. */
export default function SuppliesTab({
  supplies,
  onSetSupplyStatus,
  onAddSupply,
}: SuppliesTabProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<SupplyStatus>("low");
  const [note, setNote] = useState("");

  const needRestockCount = supplies.filter((s) => s.status !== "stocked").length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddSupply(trimmed, status, note.trim());
    setName("");
    setNote("");
    setStatus("low");
    setShowAdd(false);
  }

  return (
    <section aria-label="Supplies tab" className="space-y-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold">Shared House Supplies</h2>
          <span className="text-[11px] text-gray-500 dark:text-slate-400">
            {needRestockCount} need restock
          </span>
        </div>

        <ul className="mt-2 divide-y divide-gray-200 dark:divide-slate-700">
          {supplies.map((item) => {
            const meta = SUPPLY_STATUS_META[item.status];
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 py-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{item.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onSetSupplyStatus(item.id, SUPPLY_CYCLE[item.status])
                      }
                      aria-label={`${item.name} status: ${meta.label}. Tap to cycle`}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badgeClasses}`}
                    >
                      {meta.label}
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-slate-400">
                    {item.note ? `${item.note} · ` : ""}Updated by{" "}
                    {item.updatedByLabel}
                  </div>
                </div>

                {item.status === "stocked" ? (
                  <button
                    type="button"
                    onClick={() => onSetSupplyStatus(item.id, "low")}
                    className="shrink-0 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-800 hover:bg-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  >
                    Flag Low
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetSupplyStatus(item.id, "stocked")}
                    className="shrink-0 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-900 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200"
                  >
                    Restocked
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {showAdd ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-2.5 rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold">Flag Needed Supply</h3>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-[11px] text-gray-500 dark:text-slate-400"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            aria-label="Supply item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Dishwasher pods"
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Supply status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SupplyStatus)}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="low">Low</option>
              <option value="out">Out</option>
              <option value="stocked">Stocked</option>
            </select>
            <input
              type="text"
              aria-label="Supply note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-teal-700 py-2 text-xs font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950"
          >
            Save Supply
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="w-full rounded-xl bg-teal-700 py-2.5 text-[13px] font-semibold text-white hover:bg-teal-800 dark:bg-teal-400 dark:text-teal-950 dark:hover:bg-teal-300"
        >
          + Flag Low Supply
        </button>
      )}
    </section>
  );
}
