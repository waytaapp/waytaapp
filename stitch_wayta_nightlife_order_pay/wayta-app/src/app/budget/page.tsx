import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";

const BUDGET_LIMIT = 1500;
const BUDGET_SPENT = 850;
const CIRCLE_RADIUS = 80;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const CIRCLE_OFFSET = CIRCLE_CIRCUMFERENCE * (1 - BUDGET_SPENT / BUDGET_LIMIT);

const RECENT_ACTIVITY = [
  { venue: "Black Door", detail: "22:14 • Drinks & entry", amount: 450, icon: "local_bar" },
  { venue: "Sumo", detail: "20:30 • Table service", amount: 400, icon: "restaurant" },
];

export default function BudgetDashboardPage() {
  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-32">
      <WaytaHeader variant="menu" />

      <main className="pt-24 px-5 max-w-lg mx-auto space-y-6">
        {/* Tonight's budget */}
        <section className="rounded-lg border border-border bg-surface-container/70 backdrop-blur-md p-6 flex flex-col items-center gap-4 relative overflow-hidden">
          <h2 className="text-[17px] font-semibold w-full text-fg-0">Tonight&apos;s budget</h2>
          <div className="relative flex items-center justify-center py-4">
            <svg className="w-48 h-48">
              <circle
                className="text-border"
                cx="96"
                cy="96"
                fill="transparent"
                r={CIRCLE_RADIUS}
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-primary"
                style={{ transition: "stroke-dashoffset var(--dur-ui) var(--ease-out)", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                cx="96"
                cy="96"
                fill="transparent"
                r={CIRCLE_RADIUS}
                stroke="currentColor"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={CIRCLE_OFFSET}
                strokeLinecap="round"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-4xl font-bold font-mono text-fg-0">R{BUDGET_SPENT.toLocaleString()}</span>
              <span className="text-fg-2 text-[12px] font-medium">
                Spent of R{BUDGET_LIMIT.toLocaleString()}
              </span>
            </div>
          </div>
          <button className="w-full h-14 bg-primary text-black font-semibold rounded-full hover:bg-accent-hover active:scale-95 transition-all" style={{ boxShadow: "var(--glow-amber)" }}>
            Update budget
          </button>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-surface-container/70 backdrop-blur-md p-5 flex flex-col justify-between gap-4">
            <div>
              <p className="text-fg-1 font-medium text-sm">Location sharing</p>
              <p className="text-fg-2 text-xs">Live with friends</p>
            </div>
            <span className="text-xs font-medium text-primary">On</span>
          </div>
          <div className="rounded-lg border border-border bg-surface-container/70 backdrop-blur-md p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-go text-xl">
                account_balance_wallet
              </span>
              <span className="font-medium text-fg-1 text-sm">VIP wallet</span>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight font-mono text-fg-0">R3,420</span>
              <p className="text-[12px] text-fg-2 font-medium mt-1">
                Available credit
              </p>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="space-y-4">
          <h3 className="text-[17px] font-semibold text-fg-0">Recent activity</h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((entry) => (
              <div
                key={entry.venue}
                className="bg-surface-container/70 backdrop-blur-md border border-border p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-surface-container-low flex items-center justify-center border border-border">
                    <span className="material-symbols-outlined text-primary">{entry.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-fg-0">{entry.venue}</p>
                    <p className="text-xs text-fg-2">{entry.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold font-mono text-fg-0">-R{entry.amount.toFixed(2)}</p>
                  <p className="text-[11px] text-go font-medium">Success</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <WaytaBottomNav active="wallet" />
    </div>
  );
}
