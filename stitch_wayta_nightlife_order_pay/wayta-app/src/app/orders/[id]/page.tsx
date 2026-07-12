import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";

type OrderTrackingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <WaytaHeader variant="back" backHref="/" />

      <main className="pt-24 pb-32 px-3 min-h-screen">
        {/* Status updating indicator */}
        <div className="mb-4 flex items-center gap-3 bg-go/10 border border-go/30 p-4 rounded-lg">
          <span className="material-symbols-outlined text-go text-lg">
            sync
          </span>
          <span className="text-sm font-medium text-go">
            Order status updating in real-time
          </span>
        </div>

        {/* Order status card */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface-container mb-6 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-fg-2 text-[12px] font-medium mb-1">
                Current order
              </p>
              <h2 className="text-2xl font-bold font-mono text-fg-0">{id}</h2>
            </div>
            <div className="px-3 py-1 bg-surface-container-low border border-border rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warn" />
              <span className="text-xs font-medium text-warn font-mono">
                PREPARING
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="flex flex-col gap-6 py-4">
              {/* Received */}
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-6 w-0.5 h-12 bg-go" />
                <div className="z-10 w-6 h-6 rounded-full bg-go flex items-center justify-center text-black flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">
                    check
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-fg-0">Order received</h3>
                  <p className="text-fg-2 text-sm">
                    22:14 • 2x Electric gin, 1x Neon lager
                  </p>
                </div>
              </div>

              {/* Preparing */}
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-6 w-0.5 h-12 bg-border" />
                <div className="z-10 w-6 h-6 rounded-full bg-background border-2 border-warn flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-warn" />
                </div>
                <div>
                  <h3 className="font-medium text-warn">
                    Preparing
                  </h3>
                  <p className="text-fg-2 text-sm">
                    Your mixologist is crafting this order.
                  </p>
                </div>
              </div>

              {/* Ready */}
              <div className="flex gap-4">
                <div className="z-10 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-sm text-fg-2">
                    done_all
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-fg-3">
                    Ready for collection
                  </h3>
                  <p className="text-fg-3 text-sm">
                    Head to the bar when notified.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center border border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-gradient-to-br from-primary to-accent-hover" />
              <div className="w-48 h-48 bg-white p-2 rounded-lg relative mb-4" style={{ boxShadow: "var(--glow-amber)" }}>
                <img
                  alt="Order QR Code"
                  className="w-full h-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnKOkZNnaerfCECkupJAOVxCCa73GxyjF-KXF91sLJdzniNFPLHEhxUksr3ZePcFsuBnL4MNJ2rGL0TlFTecK9IkpR9_BcFca88vMRE4LsrCnWXOucZ6GnIigSVzvugj06ynKHvupP1-rWHOxu6Efj9Gdi7XaBuUBzE-Jbw_rtHaLKDgKYIMCW1iHO_I82QKA_XaxcWx-2fypVx_vqTgytzmuRdsiaOTe-Y732zzlxbcDoFIG5lx4zGUCDyUbMkxPGBjhupy9vAUM"
                />
              </div>
              <p className="text-[12px] text-fg-2 text-center font-medium">
                Show this at the pickup counter
              </p>
            </div>
          </div>
        </div>

        {/* Wait time cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-surface-container border border-border p-4 rounded-lg flex flex-col justify-center">
            <span className="text-fg-2 text-[12px] font-medium mb-2">
              Est. wait
            </span>
            <span className="text-go text-4xl font-bold leading-none">
              04<span className="text-fg-3 font-normal text-2xl ml-1">m</span>
            </span>
          </div>
          <div className="bg-surface-container border border-border p-4 rounded-lg flex flex-col justify-center">
            <span className="text-fg-2 text-[12px] font-medium mb-2">
              Collection time
            </span>
            <span className="text-4xl font-bold leading-none text-fg-0">22:25</span>
          </div>
        </div>

        <button className="w-full h-14 rounded-full border-2 border-stop text-stop font-semibold flex items-center justify-center gap-2 hover:bg-stop/10 active:scale-95 transition-all">
          <span className="material-symbols-outlined">contact_support</span>
          Need help with this order
        </button>
      </main>

      <WaytaBottomNav active="orders" hidden={false} />
    </div>
  );
}
