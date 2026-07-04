import Link from "next/link";

type WaytaHeaderProps = {
  variant?: "back" | "menu";
  backHref?: string;
};

export function WaytaHeader({ variant = "menu", backHref = "/venues" }: WaytaHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-black/80 backdrop-blur-lg border-b border-zinc-800 font-display tracking-tight">
      <div className="flex items-center gap-4">
        {variant === "back" ? (
          <Link
            href={backHref}
            className="material-symbols-outlined text-primary cursor-pointer"
            aria-label="Back"
          >
            arrow_back
          </Link>
        ) : (
          <span className="material-symbols-outlined text-primary">menu</span>
        )}
        <Link href="/venues" className="text-2xl font-black text-primary italic tracking-wider">
          Wayta
        </Link>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
        <span className="material-symbols-outlined text-zinc-500">account_circle</span>
      </div>
    </header>
  );
}
