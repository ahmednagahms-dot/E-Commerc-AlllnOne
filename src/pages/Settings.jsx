import DashboardLayout from "../components/layout/DashboardLayout";
import { Info } from "lucide-react";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-gray-500">Store configuration.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 flex flex-col items-center text-center max-w-md mx-auto">
        {/* Store Logo Container */}
        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center mb-4 shadow-xs">
          <img
            src={STORE_LOGO_URL}
            alt="AllInOne Store"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 text-base mb-2">
          Store settings coming soon
        </h3>

        {/* Description info */}
        <p className="text-xs sm:text-sm text-gray-500 flex items-start gap-2 text-left bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
          <span>
            Store-level configuration (name, logo, shipping, taxes) requires a
            dedicated backend endpoint that doesn't exist yet. To manage your
            personal account, visit your{" "}
            <a
              href="/dashboard/profile"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
            >
              Profile page
            </a>
            .
          </span>
        </p>
      </div>
    </DashboardLayout>
  );
}