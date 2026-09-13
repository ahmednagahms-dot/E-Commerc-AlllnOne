import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function Wishlists() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [Wishlists, setWishlists] = useState([]);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await api.get("/wishlists");

        setWishlists(
          Array.isArray(response.data)
            ? response.data
            : response.data?.Wishlists || response.data?.data || [],
        );
      } catch (error) {
        console.error("Error fetching Wishlists:", error);
        setWishlists([]);
        toast.error("Failed Loading Wishlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text={t("wishlists.loading")} />
      ) : (
        <div className="animate-fade-in w-full page-surface">
          <div className="p-6 bg-[#f5f7fa] min-h-screen page-surface">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <p className="text-xs tracking-[0.3em] text-primary-600 font-semibold mb-2">
                {t("navigation.wishlists")}
              </p>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("wishlists.title")}
              </h1>

              <p className="text-gray-500 text-sm">
                {t("wishlists.description")}
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  {t("wishlists.loading")}
                </h2>
              </div>
            )}

            {/* Empty */}
            {!loading && Wishlists.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  {t("wishlists.empty")}
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
