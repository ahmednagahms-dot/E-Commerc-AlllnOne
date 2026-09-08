import DashboardLayout from "../components/layout/DashboardLayout";
import { Info } from "lucide-react";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500">Store configuration.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
          <div className="w-16 h-14 rounded-2xl bg-white shrink-0">
            <img
              src={STORE_LOGO_URL}
              alt="AllInOne"
              className="w-full h-full object-contain"
            />
          </div>
          </div>
        </div>
        <h3 className="font-semibold mb-2">Store settings coming soon</h3>
        <p className="text-sm text-gray-500 flex items-start gap-2 text-left">
          <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
          Store-level configuration (name, logo, shipping, taxes) requires a dedicated backend
          endpoint that doesn't exist yet. To manage your personal account, visit your{" "}
          <a href="/dashboard/profile" className="text-primary-600 underline">Profile page</a>.
        </p>
      </div>
    </DashboardLayout>
  );
}