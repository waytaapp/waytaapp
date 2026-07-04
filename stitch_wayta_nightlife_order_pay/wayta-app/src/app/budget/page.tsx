import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";

const BUDGET_LIMIT = 1500;
const BUDGET_SPENT = 850;
const CIRCLE_RADIUS = 80;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const CIRCLE_OFFSET = CIRCLE_CIRCUMFERENCE * (1 - BUDGET_SPENT / BUDGET_LIMIT);

const RECENT_ACTIVITY = [
  { venue: "Black Door", detail: "22:14 • Drinks & Entry", amount: 450, icon: "local_bar" },
  { venue: "Sumo", detail: "20:30 • Table Service", amount: 400, icon: "restaurant" },
];

export default function BudgetDashboardPage() {
  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-32">
      <WaytaHeader variant="menu" />

      <main className="pt-24 px-5 max-w-lg mx-auto space-y-6">
        {/* Tonight's budget */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-6 flex flex-col items-center gap-4 relative overflow-hidden">
          <h2 className="text-lg font-semibold w-full">Tonight&apos;s Budget</h2>
          <div className="relative flex items-center justify-center py-4">
            <svg className="w-48 h-48">
              <circle
                className="text-zinc-800"
                cx="96"
                cy="96"
                fill="transparent"
                r={CIRCLE_RADIUS}
                stroke="currentColor"
                strokeWidth="12"
              />
              <circle
                className="text-primary"
                style={{ transition: "stroke-dashoffset 0.35s", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
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
              <span className="text-4xl font-bold">R{BUDGET_SPENT.toLocaleString()}</span>
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                Spent of R{BUDGET_LIMIT.toLocaleString()}
              </span>
            </div>
          </div>
          <button className="w-full h-14 bg-primary text-fg-on-accent font-semibold rounded-lg shadow-[0_0_15px_rgba(var(--glow-accent-rgb),0.3)] active:scale-95 transition-transform">
            Update Budget
          </button>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-5 flex flex-col justify-between gap-4">
            <div>
              <p className="text-zinc-400 font-semibold text-sm">Location Sharing</p>
              <p className="text-xs text-zinc-500">Live with friends</p>
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">On</span>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-xl">
                account_balance_wallet
              </span>
              <span className="font-semibold text-secondary text-sm">VIP Vault</span>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">R3,420</span>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                Available Credit
              </p>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((entry) => (
              <div
                key={entry.venue}
                className="bg-zinc-900/70 backdrop-blur-md border border-zinc-800 p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800">
                    <span className="material-symbols-outlined text-primary">{entry.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{entry.venue}</p>
                    <p className="text-xs text-zinc-500">{entry.detail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">-R{entry.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">Success</p>
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
