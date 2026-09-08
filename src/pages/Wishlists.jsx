import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

export default function Wishlists() {
  const [loading, setLoading] = useState(true);
  const [Wishlists, setWishlists] = useState([]);

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const response = await api.get("/wishlists");

        setWishlists(
          Array.isArray(response.data)
            ? response.data
            : response.data?.Wishlists || response.data?.data || []
        );
      } catch (error) {
        console.error("Error fetching Wishlists:", error);
        setWishlists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 bg-[#f5f7fa] min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <p className="text-xs tracking-[0.3em] text-primary-600 font-semibold mb-2">
           Wishlists
          </p>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Wishlists overview
          </h1>

          <p className="text-gray-500 text-sm">
            All active wishlists returned from the API are rendered here with their latest item details.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
            <h2 className="text-lg font-semibold text-gray-400">
              Loading wishlists...
            </h2>
          </div>
        )}

        {/* Empty */}
        {!loading && Wishlists.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
            <h2 className="text-lg font-semibold text-gray-400">
              No wishlists returned from API
            </h2>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}