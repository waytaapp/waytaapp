"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/bottom-sheet";
import { QUICK_BUDGET_AMOUNTS } from "@/lib/budget";

interface BudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number | null;
  onSave: (amount: number) => void;
}

export function BudgetDialog({ isOpen, onClose, currentLimit, onSave }: BudgetDialogProps) {
  const [value, setValue] = useState(currentLimit ? String(currentLimit) : "");
  const amount = Number(value);
  const isValid = value.trim() !== "" && Number.isFinite(amount) && amount > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave(amount);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Set your night limit.">
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="budget-amount" className="block text-fg-2 text-[13px] font-medium mb-2">
            Nightly limit
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-container-low px-4 h-16">
            <span className="text-primary text-2xl font-mono font-semibold" aria-hidden="true">
              R
            </span>
            <input
              id="budget-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              aria-label="Nightly limit in rand"
              className="flex-1 bg-transparent text-2xl font-mono font-semibold text-fg-0 placeholder:text-fg-3 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          {QUICK_BUDGET_AMOUNTS.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setValue(String(quickAmount))}
              className={`flex-1 h-11 rounded-full border font-mono font-medium text-sm transition-all active:scale-95 ${
                amount === quickAmount
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-fg-1 hover:border-border-strong"
              }`}
            >
              R{quickAmount}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!isValid}
          className="w-full h-14 rounded-full bg-primary text-black font-semibold hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
          style={{ boxShadow: isValid ? "var(--glow-amber)" : undefined }}
        >
          Set limit
        </button>
      </div>
    </BottomSheet>
  );
}
