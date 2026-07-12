import Link from "next/link";

type WaytaHeaderProps = {
  variant?: "back" | "menu";
  backHref?: string;
};

export function WaytaHeader({ variant = "menu", backHref = "/venues" }: WaytaHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-background/80 backdrop-blur-lg border-b border-border font-display tracking-tight">
      <div className="flex items-center gap-4">
        {variant === "back" ? (
          <Link
            href={backHref}
            className="material-symbols-outlined text-primary cursor-pointer hover:text-accent-hover active:scale-95 transition-transform"
            aria-label="Back"
          >
            arrow_back
          </Link>
        ) : (
          <button className="material-symbols-outlined text-primary hover:text-accent-hover active:scale-95 transition-transform" aria-label="Menu">menu</button>
        )}
        <Link href="/" className="text-2xl font-black text-primary italic tracking-wider hover:text-accent-hover transition-colors">
          Wayta
        </Link>
      </div>
      <button className="w-10 h-10 rounded-full overflow-hidden border border-border bg-surface-container flex items-center justify-center hover:border-primary transition-colors" aria-label="Profile">
        <span className="material-symbols-outlined text-fg-2">account_circle</span>
      </button>
    </header>
  );
}
