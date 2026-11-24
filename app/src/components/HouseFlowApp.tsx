"use client";

import { useEffect, useState } from "react";
import {
  advanceWeeklyRotation,
  cycleChoreStatus,
  isGarbageNight,
} from "@/lib/logic";
import { createSeedState, loadState, resetState, saveState } from "@/lib/storage";
import {
  ChoreArea,
  DayOfWeek,
  HouseFlowState,
  RepairStatus,
  SupplyStatus,
  TabKey,
} from "@/lib/types";
import ChoresTab from "./ChoresTab";
import QuickAddModal from "./QuickAddModal";
import RepairsTab from "./RepairsTab";
import SuppliesTab from "./SuppliesTab";
import TodayTab from "./TodayTab";

const TABS: { key: TabKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "supplies", label: "Supplies" },
  { key: "chores", label: "Chores" },
  { key: "repairs", label: "Repairs" },
];

/** Root HouseFlow mobile-first app workspace backed by browser localStorage. */
export default function HouseFlowApp() {
  const [state, setState] = useState<HouseFlowState>(() => createSeedState());
  const [hydrated, setHydrated] = useState(false);
  const [quickAddMode, setQuickAddMode] = useState<"dish" | "chore" | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
    document.documentElement.classList.toggle(
      "dark",
      state.preferences.theme === "dark"
    );
  }, [state, hydrated]);

  const { household, preferences, dishes, chores, supplies, repairs, rules } = state;
  const activeTab = preferences.activeTab;
  const isDark = preferences.theme === "dark";
  const nowMs = Date.now() + preferences.simulatedHoursOffset * 60 * 60 * 1000;

  const garbageDue = isGarbageNight(
    household.garbageDay,
    nowMs,
    preferences.forceGarbageEve
  );

  function setTab(tab: TabKey) {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, activeTab: tab },
    }));
  }

  function toggleTheme() {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === "dark" ? "light" : "dark",
      },
    }));
  }

  function setActiveMember(memberLabel: string) {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, activeMemberLabel: memberLabel },
    }));
  }

  function handleAddDish(description: string) {
    setState((prev) => ({
      ...prev,
      dishes: [
        {
          id: `dish-${Date.now()}`,
          householdId: prev.household.id,
          loggedByLabel: prev.preferences.activeMemberLabel,
          description,
          createdAt: new Date().toISOString(),
          clearedAt: null,
        },
        ...prev.dishes,
      ],
    }));
  }

  function handleClearDish(dishId: string) {
    const clearedAt = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d) =>
        d.id === dishId ? { ...d, clearedAt } : d
      ),
    }));
  }

  function handleMarkTrashDone() {
    setState((prev) => ({
      ...prev,
      trashCompletedBy: prev.preferences.activeMemberLabel,
    }));
  }

  function handleChangeGarbageDay(day: DayOfWeek) {
    setState((prev) => ({
      ...prev,
      household: { ...prev.household, garbageDay: day },
      trashCompletedBy: null,
    }));
  }

  function handleCycleChore(choreId: string) {
    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      chores: prev.chores.map((c) => {
        if (c.id !== choreId) return c;
        const nextStatus = cycleChoreStatus(c.status);
        return {
          ...c,
          status: nextStatus,
          completedAt: nextStatus === "completed" ? nowIso : null,
        };
      }),
    }));
  }

  function handleAddChore(
    title: string,
    area: ChoreArea,
    assignedToLabel: string
  ) {
    setState((prev) => ({
      ...prev,
      chores: [
        {
          id: `chore-${Date.now()}`,
          householdId: prev.household.id,
          title,
          area,
          status: "open",
          assignedToLabel,
          isWeeklyRotation: false,
          rotationIndex: 0,
          completedAt: null,
        },
        ...prev.chores,
      ],
    }));
  }

  function handleAdvanceWeek() {
    setState((prev) => ({
      ...prev,
      weekNumber: prev.weekNumber + 1,
      trashCompletedBy: null,
      chores: advanceWeeklyRotation(prev.chores, prev.household.memberLabels),
    }));
  }

  function handleSetSupplyStatus(supplyId: string, nextStatus: SupplyStatus) {
    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      supplies: prev.supplies.map((s) =>
        s.id === supplyId
          ? {
              ...s,
              status: nextStatus,
              updatedByLabel: prev.preferences.activeMemberLabel,
              updatedAt: nowIso,
            }
          : s
      ),
    }));
  }

  function handleAddSupply(name: string, status: SupplyStatus, note: string) {
    setState((prev) => ({
      ...prev,
      supplies: [
        {
          id: `sup-${Date.now()}`,
          householdId: prev.household.id,
          name,
          status,
          note,
          updatedByLabel: prev.preferences.activeMemberLabel,
          updatedAt: new Date().toISOString(),
        },
        ...prev.supplies,
      ],
    }));
  }

  function handleSetRepairStatus(repairId: string, nextStatus: RepairStatus) {
    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      repairs: prev.repairs.map((r) =>
        r.id === repairId
          ? {
              ...r,
              status: nextStatus,
              fixedAt: nextStatus === "fixed" ? nowIso : null,
            }
          : r
      ),
    }));
  }

  function handleAddRepair(title: string, location: string) {
    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      repairs: [
        {
          id: `rep-${Date.now()}`,
          householdId: prev.household.id,
          title,
          location,
          status: "reported",
          loggedByLabel: prev.preferences.activeMemberLabel,
          createdAt: nowIso,
          reportedAt: nowIso,
          fixedAt: null,
        },
        ...prev.repairs,
      ],
    }));
  }

  function handleToggleRule(ruleId: string) {
    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      rules: prev.rules.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              checked: !r.checked,
              lastCheckedAt: !r.checked ? nowIso : null,
            }
          : r
      ),
    }));
  }

  function handleAddRule(title: string, subtitle: string) {
    setState((prev) => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          id: `rule-${Date.now()}`,
          householdId: prev.household.id,
          title,
          subtitle,
          checked: false,
          lastCheckedAt: null,
        },
      ],
    }));
  }

  function handleToggleSimulatedHours() {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        simulatedHoursOffset:
          prev.preferences.simulatedHoursOffset > 0 ? 0 : 3,
      },
    }));
  }

  function handleToggleForceGarbageEve() {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        forceGarbageEve: !prev.preferences.forceGarbageEve,
      },
    }));
  }

  function handleResetSampleData() {
    setState(resetState());
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-200 px-3 py-5 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-[640px] max-w-[390px] flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {/* App Header */}
          <header className="flex items-center justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3.5 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <h1 className="text-base font-bold">{household.name}</h1>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400">
                <span>Invite: {household.inviteCode}</span>
                <span>·</span>
                <label className="sr-only" htmlFor="member-switcher">
                  Active housemate
                </label>
                <select
                  id="member-switcher"
                  value={preferences.activeMemberLabel}
                  onChange={(e) => setActiveMember(e.target.value)}
                  className="rounded bg-transparent font-medium text-gray-700 underline decoration-dotted focus:outline-none dark:text-slate-200"
                >
                  {household.memberLabels.map((label) => (
                    <option
                      key={label}
                      value={label}
                      className="bg-white text-gray-900 dark:bg-slate-800 dark:text-slate-100"
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-semibold text-gray-800 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              Mode: {isDark ? "Light" : "Dark"}
            </button>
          </header>

          {/* Main Tab Content */}
          <main className="flex-1 p-3.5">
            {activeTab === "today" && (
              <TodayTab
                dishes={dishes}
                chores={chores}
                rules={rules}
                memberLabels={household.memberLabels}
                activeMemberLabel={preferences.activeMemberLabel}
                garbageDay={household.garbageDay}
                garbageDue={garbageDue}
                trashCompletedBy={state.trashCompletedBy}
                nowMs={nowMs}
                onClearDish={handleClearDish}
                onMarkTrashDone={handleMarkTrashDone}
                onCycleChore={handleCycleChore}
                onToggleRule={handleToggleRule}
                onAddRule={handleAddRule}
                onOpenQuickAdd={(mode) => setQuickAddMode(mode)}
              />
            )}

            {activeTab === "supplies" && (
              <SuppliesTab
                supplies={supplies}
                onSetSupplyStatus={handleSetSupplyStatus}
                onAddSupply={handleAddSupply}
              />
            )}

            {activeTab === "chores" && (
              <ChoresTab
                chores={chores}
                memberLabels={household.memberLabels}
                weekNumber={state.weekNumber}
                garbageDay={household.garbageDay}
                onCycleChore={handleCycleChore}
                onAdvanceWeek={handleAdvanceWeek}
                onChangeGarbageDay={handleChangeGarbageDay}
                onOpenAddChore={() => setQuickAddMode("chore")}
              />
            )}

            {activeTab === "repairs" && (
              <RepairsTab
                repairs={repairs}
                simulatedHoursOffset={preferences.simulatedHoursOffset}
                forceGarbageEve={preferences.forceGarbageEve}
                onSetRepairStatus={handleSetRepairStatus}
                onAddRepair={handleAddRepair}
                onToggleSimulatedHours={handleToggleSimulatedHours}
                onToggleForceGarbageEve={handleToggleForceGarbageEve}
                onResetSampleData={handleResetSampleData}
              />
            )}
          </main>

          {/* Bottom 4-Tab Bar */}
          <nav
            aria-label="Primary tabs"
            className="grid grid-cols-4 gap-1 border-t border-gray-200 bg-white px-1.5 pb-2.5 pt-1.5 dark:border-slate-700 dark:bg-slate-800"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setTab(tab.key)}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "rounded-xl bg-teal-100 py-2 text-[11px] font-semibold text-teal-900 dark:bg-teal-950 dark:text-teal-200"
                      : "rounded-xl py-2 text-[11px] font-semibold text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {quickAddMode && (
          <QuickAddModal
            initialMode={quickAddMode}
            memberLabels={household.memberLabels}
            activeMemberLabel={preferences.activeMemberLabel}
            onClose={() => setQuickAddMode(null)}
            onAddDish={handleAddDish}
            onAddChore={handleAddChore}
          />
        )}
      </div>
    </div>
  );
}
