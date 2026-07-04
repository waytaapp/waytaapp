import Link from "next/link";

type NavTab = "explore" | "menu" | "orders" | "vip" | "wallet";

const TABS: Array<{ id: NavTab; label: string; icon: string; href?: string }> = [
  { id: "explore", label: "Explore", icon: "explore", href: "/venues" },
  { id: "menu", label: "Menu", icon: "restaurant_menu", href: "/venues/black-door/menu" },
  { id: "orders", label: "Orders", icon: "confirmation_number", href: "/orders/WT-8842" },
  { id: "vip", label: "VIP", icon: "event_seat" },
  { id: "wallet", label: "Wallet", icon: "account_balance_wallet", href: "/budget" },
];

export function WaytaBottomNav({ active }: { active: NavTab }) {
  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-black/90 backdrop-blur-xl border-t border-zinc-800 shadow-[0_-4px_20px_rgba(var(--glow-accent-rgb),0.1)]">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const className = isActive
          ? "flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(var(--glow-accent-rgb),0.6)] scale-110 duration-200"
          : "flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all";
        const content = (
          <>
            <span className="material-symbols-outlined">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{tab.label}</span>
          </>
        );

        return tab.href ? (
          <Link key={tab.id} href={tab.href} className={className}>
            {content}
          </Link>
        ) : (
          <div key={tab.id} className={className}>
            {content}
          </div>
        );
      })}
    </nav>
  );
}
