import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Pagination from "../components/ui/Pagination";
import { ShoppingCart } from "lucide-react";
import api from "../api/axios";

const LIMIT = 10;

export default function Carts() {
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/admin/carts", {
          params: { page: currentPage, limit: LIMIT },
        });
        setCarts(response.data.carts);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError("Failed to load active carts.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarts();
  }, [currentPage]);

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold text-primary-500 tracking-widest uppercase">Admin · Management</p>
          <h1 className="text-2xl font-bold">Active Carts</h1>
          <p className="text-sm text-gray-500">Carts customers currently have items in.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-sm text-gray-400">active carts</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto p-4">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading carts...</div>
          ) : error ? (
            <div className="text-center py-16 text-danger">{error}</div>
          ) : carts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingCart size={32} className="mb-2 text-gray-300" />
              No active carts right now.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b">
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Items</th>
                  <th className="py-2 font-medium">Item Count</th>
                  <th className="py-2 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {carts.map((cart) => (
                  <tr key={cart._id} className="border-b last:border-0">
                    <td className="py-3">
                      <p className="font-medium">{cart.user?.username || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{cart.user?.email}</p>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col gap-1">
                        {cart.items.slice(0, 2).map((item) => (
                          <span key={item._id} className="text-gray-600 text-xs">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                        {cart.items.length > 2 && (
                          <span className="text-xs text-gray-400">+{cart.items.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">{cart.itemCount}</td>
                    <td className="py-3 font-medium">${cart.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && !error && carts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={total}
              itemsPerPage={LIMIT}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}











