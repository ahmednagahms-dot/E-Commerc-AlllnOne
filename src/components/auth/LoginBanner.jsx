import { ShieldCheck } from "lucide-react";

export default function LoginBanner() {
  return (
    <div className="hidden lg:flex w-1/2 bg-sidebar text-white flex-col justify-between p-10">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center font-bold">K</div>
        <div>
          <h1 className="font-semibold text-sm">Koda Store</h1>
          <p className="text-xs text-white/50">E-commerce Admin</p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold leading-tight">
          Manage smarter.
          <br />
          <span className="text-primary-400">Sell more.</span>
        </h2>
        <p className="text-white/60 mt-3 text-sm max-w-xs">
          Powerful tools and insights to help you run your store, grow your business, and delight your customers.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg text-sm text-white/70">
        <ShieldCheck size={18} className="text-primary-400" />
        <div>
          <p className="font-medium text-white">Secure. Fast. Reliable.</p>
          <p className="text-xs">Your store. Your data. Always protected.</p>
        </div>
      </div>
    </div>
  );
}