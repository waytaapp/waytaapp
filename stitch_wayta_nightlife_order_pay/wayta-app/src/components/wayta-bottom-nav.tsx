import Link from "next/link";

type NavTab = "explore" | "menu" | "orders" | "scan" | "wallet";

const TABS: Array<{ id: NavTab; label: string; icon: string; href?: string }> = [
  { id: "explore", label: "Explore", icon: "explore", href: "/venues" },
  { id: "orders", label: "Orders", icon: "receipt_long", href: "/orders" },
  { id: "scan", label: "Scan", icon: "qr_code_scanner", href: "#scan" },
  { id: "menu", label: "Menu", icon: "restaurant_menu", href: "/venues/black-door/menu" },
  { id: "wallet", label: "Wallet", icon: "account_balance_wallet", href: "/budget" },
];

interface WaytaBottomNavProps {
  active?: NavTab;
  hidden?: boolean;
}

export function WaytaBottomNav({ active, hidden = false }: WaytaBottomNavProps) {
  if (hidden) return null;

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-end h-24 px-2 pb-4 bg-background/90 backdrop-blur-xl border-t border-border">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const isScan = tab.id === "scan";

        if (isScan) {
          return (
            <button
              key={tab.id}
              className="relative flex flex-col items-center justify-center"
              aria-label="Scan QR code"
            >
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full bg-primary opacity-20 blur-lg"
                  style={{ boxShadow: "var(--glow-amber)" }}
                />
                <div className="relative w-14 h-14 rounded-full bg-primary hover:bg-accent-hover active:scale-95 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-black text-2xl">
                    {tab.icon}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-fg-1 mt-2 capitalize">
                {tab.label}
              </span>
            </button>
          );
        }

        const content = (
          <>
            <span
              className={`material-symbols-outlined ${
                isActive ? "text-primary" : "text-fg-2"
              }`}
            >
              {tab.icon}
            </span>
            <span
              className={`text-[11px] font-medium mt-1 capitalize ${
                isActive ? "text-primary" : "text-fg-2"
              }`}
            >
              {tab.label}
            </span>
          </>
        );

        return tab.href ? (
          <Link
            key={tab.id}
            href={tab.href}
            className="flex flex-col items-center justify-center hover:text-primary transition-colors active:scale-95"
          >
            {content}
          </Link>
        ) : (
          <div
            key={tab.id}
            className="flex flex-col items-center justify-center hover:text-primary transition-colors cursor-pointer"
          >
            {content}
          </div>
        );
      })}
    </nav>
  );
}
