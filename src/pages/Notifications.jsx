import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [Notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/Notifications");

        setNotifications(
          Array.isArray(response.data)
            ? response.data
            : response.data?.Notifications || response.data?.data || [],
        );
        toast.success("Notifications loaded successfully!");
      } catch (error) {
        console.error("Error fetching Notifications:", error);
        setNotifications([]);
        toast.error("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text="Loading notifications..." />
      ) : (
        <div className="animate-fade-in w-full">
          <div className="p-6 bg-[#f5f7fa] min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <p className="text-xs tracking-[0.3em] text-primary-600 font-semibold mb-2">
                Notifications
              </p>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Notifications overview
              </h1>

              <p className="text-gray-500 text-sm">
                All active Notifications returned from the API are rendered here
                with their latest item details.
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  Loading Notifications...
                </h2>
              </div>
            )}

            {/* Empty */}
            {!loading && Notifications.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  No Notifications returned from API
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
