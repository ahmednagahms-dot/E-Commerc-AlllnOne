import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

export default function Carts() {
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await api.get("/carts");

        setCarts(
          Array.isArray(response.data)
            ? response.data
            : response.data?.carts || response.data?.data || []
        );
      } catch (error) {
        console.error("Error fetching carts:", error);
        setCarts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 bg-[#f5f7fa] min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <p className="text-xs tracking-[0.3em] text-primary-600 font-semibold mb-2">
            CARTS
          </p>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cart overview
          </h1>

          <p className="text-gray-500 text-sm">
            All active carts returned from the API are rendered here with their latest item details.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
            <h2 className="text-lg font-semibold text-gray-400">
              Loading carts...
            </h2>
          </div>
        )}

        {/* Empty */}
        {!loading && carts.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
            <h2 className="text-lg font-semibold text-gray-400">
              No carts returned from API
            </h2>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}