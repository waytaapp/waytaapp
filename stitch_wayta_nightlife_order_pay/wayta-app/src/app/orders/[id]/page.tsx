import Link from "next/link";

type OrderTrackingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-black/80 backdrop-blur-lg border-b border-zinc-800 font-display tracking-tight">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="material-symbols-outlined text-cyan-400 cursor-pointer"
            aria-label="Back"
          >
            arrow_back
          </Link>
          <h1 className="text-2xl font-black text-cyan-400 italic tracking-wider">
            Wayta
          </h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
          {/* Keeping <img> to avoid configuring remote image domains yet */}
          <img
            alt="User profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPIL-KeekG1R8WJYb_4tBBI670VeCaH5GDM8Abb4jqgFMVuQyt3RRqbsizExIBsYeye7wfuOdX8Wb7khfR6UyqyztkXE2Yliy5cXOHcCLXVIBuHz3X5mfYx8oWNcj2De_B1C3jGOvMHAtBW-gZb71E7o18QcXGDG3NpR4ievwjdD03w7-kWfJIbijpZxrRmE5g_n2U6fBxVB5GkWcvHvOSeQ14S4ZbbIc70GRXYiB9LJ5_oRRuAORzTQxMhVWcVgUz8ZrE2R6WHmk"
          />
        </div>
      </header>

      <main className="pt-24 pb-32 px-3 min-h-screen">
        <div className="mb-4 flex items-center gap-3 bg-primary-container/10 border border-primary-container/30 p-4 rounded-xl">
          <span className="material-symbols-outlined text-primary-container animate-pulse">
            sync
          </span>
          <span className="text-sm font-semibold text-primary-container">
            Order status updating in real-time
          </span>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-surface-container-low mb-6 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                Current Order
              </p>
              <h2 className="text-2xl font-semibold">{id}</h2>
            </div>
            <div className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="text-xs font-bold text-primary-container">
                PREPARING
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6 py-4">
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-6 w-0.5 h-12 bg-primary-container" />
                <div className="z-10 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-sm font-bold">
                    check
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">Order Received</h3>
                  <p className="text-zinc-500 text-sm">
                    22:14 • 2x Electric Gin, 1x Neon Lager
                  </p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-6 w-0.5 h-12 bg-zinc-800" />
                <div className="z-10 w-6 h-6 rounded-full bg-black border-2 border-primary-container flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-container">
                    Preparing
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Our mixologist is crafting your order.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="z-10 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-zinc-700">
                    done_all
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-600">
                    Ready for Collection
                  </h3>
                  <p className="text-zinc-700 text-sm">
                    Head to the bar when notified.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 p-6 rounded-xl flex flex-col items-center justify-center border border-zinc-900 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-gradient-to-br from-cyan-400 to-pink-200" />
              <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] relative mb-4">
                <img
                  alt="Order QR Code"
                  className="w-full h-full grayscale brightness-90 contrast-125"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnKOkZNnaerfCECkupJAOVxCCa73GxyjF-KXF91sLJdzniNFPLHEhxUksr3ZePcFsuBnL4MNJ2rGL0TlFTecK9IkpR9_BcFca88vMRE4LsrCnWXOucZ6GnIigSVzvugj06ynKHvupP1-rWHOxu6Efj9Gdi7XaBuUBzE-Jbw_rtHaLKDgKYIMCW1iHO_I82QKA_XaxcWx-2fypVx_vqTgytzmuRdsiaOTe-Y732zzlxbcDoFIG5lx4zGUCDyUbMkxPGBjhupy9vAUM"
                />
              </div>
              <p className="text-xs text-zinc-500 text-center uppercase tracking-[0.2em] font-semibold">
                Scan at Pickup Counter
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-surface-container border border-zinc-800 p-4 rounded-xl flex flex-col justify-center h-28">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Est. Wait
            </span>
            <span className="text-primary-container text-4xl font-bold leading-none">
              04<span className="text-zinc-600 font-light text-2xl ml-1">m</span>
            </span>
          </div>
          <div className="bg-surface-container border border-zinc-800 p-4 rounded-xl flex flex-col justify-center h-28">
            <span className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Collection
            </span>
            <span className="text-4xl font-bold leading-none">22:25</span>
          </div>
        </div>

        <button className="w-full h-14 rounded-full border-2 border-secondary text-secondary font-semibold flex items-center justify-center gap-2 hover:bg-secondary/10 transition-all active:scale-[0.99]">
          <span className="material-symbols-outlined">contact_support</span>
          Need Help with this Order?
        </button>
      </main>

      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 px-2 bg-black/90 backdrop-blur-xl border-t border-zinc-800 shadow-[0_-4px_20px_rgba(0,240,255,0.1)]">
        <div className="flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Explore
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all">
          <span className="material-symbols-outlined">restaurant_menu</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Menu
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] scale-110 duration-200">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Orders
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all">
          <span className="material-symbols-outlined">event_seat</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            VIP
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-zinc-500 hover:text-white transition-all">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Wallet
          </span>
        </div>
      </nav>
    </div>
  );
}

