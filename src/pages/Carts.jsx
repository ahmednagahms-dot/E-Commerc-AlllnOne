import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { ShoppingCart, DollarSign, Users, Package, Search, RefreshCw } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Pagination from "../components/ui/Pagination";
import api from "../api/axios";

const LIMIT = 10;

export default function Carts() {
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchCarts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/orders/admin/carts", {
        params: {
          page: currentPage,
          limit: LIMIT,
          search: debouncedSearch,
        },
      });
      setCarts(response.data.carts || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view this page.");
      } else {
        setError("Failed to load active carts. Please try again.");
      }
      console.error("Error fetching carts:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchCarts();
  }, [fetchCarts]);

  // Memoized calculations
  const filteredCarts = useMemo(() => {
    if (!debouncedSearch) return carts;
    const text = debouncedSearch.toLowerCase();
    return carts.filter((cart) => {
      const username = cart.user?.username?.toLowerCase() || "";
      const email = cart.user?.email?.toLowerCase() || "";
      return username.includes(text) || email.includes(text);
    });
  }, [carts, debouncedSearch]);

  const totalValue = useMemo(() => {
    return carts.reduce((sum, cart) => sum + (cart.subtotal || 0), 0);
  }, [carts]);

  const uniqueCustomers = useMemo(() => {
    return new Set(carts.map((c) => c.user?.email).filter(Boolean)).size;
  }, [carts]);

  const stats = [
    {
      title: "Active Carts",
      value: total,
      icon: ShoppingCart,
      style: "text-cyan-600 bg-cyan-50",
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      style: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers,
      icon: Users,
      style: "text-purple-600 bg-purple-50",
    },
  ];

 const handleRefresh = async () => {
  try {
    await fetchCarts();
    toast.success("Carts updated successfully!");
  } catch (error) {
    toast.error("Failed to update carts.");
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary-500 tracking-widest uppercase">
          Admin · Management
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Active Carts</h1>
            <p className="text-sm text-gray-500">
              Carts customers currently have items in.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.style}`}
                aria-hidden="true"
              >
                <stat.icon size={18} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg max-w-sm">
          <Search size={16} className="text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            aria-label="Search carts by customer name or email"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto p-4">
          {loading ? (
            <div className="text-center py-16 text-gray-400" aria-live="polite">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
              Loading carts...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-danger" role="alert">
              <p className="font-medium">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 text-sm text-primary-500 hover:text-primary-600 underline"
              >
                Try again
              </button>
            </div>
          ) : filteredCarts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingCart size={32} className="mb-2 text-gray-300" aria-hidden="true" />
              <p className="font-medium text-gray-500">No active carts right now</p>
              <p className="text-xs mt-1">
                {search ? "No results match your search." : "Try adjusting your search."}
              </p>
            </div>
          ) : (
            <>
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="text-left text-gray-400 border-b" role="row">
                    <th className="py-2 font-medium" scope="col">
                      Customer
                    </th>
                    <th className="py-2 font-medium" scope="col">
                      Items
                    </th>
                    <th className="py-2 font-medium" scope="col">
                      Item Count
                    </th>
                    <th className="py-2 font-medium" scope="col">
                      Subtotal
                    </th>
                    <th className="py-2 font-medium" scope="col">
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCarts.map((cart) => (
                    <tr key={cart._id} className="border-b last:border-0 hover:bg-gray-50" role="row">
                      <td className="py-3" role="cell">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-semibold"
                            aria-hidden="true"
                          >
                            {cart.user?.username?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium">{cart.user?.username || "Unknown"}</p>
                            <p className="text-xs text-gray-400">{cart.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3" role="cell">
                        <div className="flex flex-col gap-1">
                          {cart.items.slice(0, 2).map((item) => (
                            <span
                              key={item._id}
                              className="text-gray-600 text-xs flex items-center gap-1"
                            >
                              <Package size={11} className="text-gray-400" aria-hidden="true" />
                              {item.name} × {item.quantity}
                            </span>
                          ))}
                          {cart.items.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{cart.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3" role="cell">
                        {cart.itemCount || cart.items.length}
                      </td>
                      <td className="py-3 font-semibold" role="cell">
                        ${cart.subtotal?.toLocaleString() || "0.00"}
                      </td>
                      <td className="py-3 text-xs text-gray-400" role="cell">
                        {formatDate(cart.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {!loading && !error && filteredCarts.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={total}
                  itemsPerPage={LIMIT}
                />
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}