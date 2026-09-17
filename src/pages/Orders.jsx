import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageLoader from "../components/ui/sessionLoader/PageLoader";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import OrderDetailsDrawer from "../components/orders/OrderDetailsDrawer";
import api from "../api/axios";

const PAGE_LIMIT = 15;

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "bg-amber-500/10",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-sky-500/10",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  processing: {
    label: "Processing",
    bg: "bg-indigo-500/10",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-purple-500/10",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-rose-500/10",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

const getOrderTotal = (order) =>
  Number(
    order?.totalOrderPrice ||
      order?.totalPrice ||
      order?.price ||
      order?.total ||
      0
  );

const Orders = () => {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return t("orders.currency", {
      amount: num.toFixed(2),
      defaultValue: `${num.toFixed(2)} EGP`,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("orders.na");
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t("orders.na");

    return new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-EG" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* ---------- Debounce search ---------- */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  /* ---------- Fetch orders ---------- */
  const fetchOrders = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: currentPage,
          limit: PAGE_LIMIT,
          sort: "-createdAt",
        };

        if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
        if (statusFilter) params.status = statusFilter;
        if (paymentFilter === "paid") params.isPaid = true;
        if (paymentFilter === "unpaid") params.isPaid = false;
        if (methodFilter) params.paymentMethodType = methodFilter;

        const response = await api.get("/orders/admin", { params, signal });
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data.orders || data.data || data.result || [];

        setOrders(list);
        setTotalPages(
          data.paginationResult?.numberOfPages ||
            data.totalPages ||
            data.numOfPages ||
            Math.ceil((data.results || list.length) / PAGE_LIMIT) ||
            1
        );
        setTotalOrders(
          data.results || data.totalOrders || data.total || list.length || 0
        );
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }

        console.error("API Error:", err);

        if (err.response?.status === 401) {
          setError(t("orders.unauthorized"));
        } else if (err.response?.status === 404) {
          setError(t("orders.notFound"));
        } else {
          setError(
            err.response?.data?.message || t("orders.loadFailed")
          );
        }
        setOrders([]);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [currentPage, debouncedSearch, statusFilter, paymentFilter, methodFilter, t]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, [fetchOrders]);

  /* ---------- Handlers ---------- */
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentFilter("");
    setMethodFilter("");
    setCurrentPage(1);
  };

  const handleOrderUpdated = (orderId, updates) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord._id === orderId || ord.id === orderId
          ? { ...ord, ...updates }
          : ord
      )
    );
  };

  const pageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  /* ---------- Render ---------- */
  return (
    <DashboardLayout>
      {loading && orders.length === 0 ? (
        <PageLoader text={t("orders.loading")} />
      ) : (
        <div className="w-full min-h-screen bg-slate-50/50 p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                {t("orders.management")}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {t("orders.orders")}
              </h1>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm px-5 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 leading-none block">
                  {totalOrders}
                </span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  {t("orders.totalOrders")}
                </span>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
            {/* Toolbar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:bg-slate-800/40 flex flex-wrap gap-3 justify-between items-center">
              <div className="relative min-w-[260px] flex-1">
                <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleFilterChange(setSearchTerm)}
                  placeholder={t("orders.search")}
                  aria-label={t("orders.searchAria")}
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 rtl:pl-9 rtl:pr-10 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setDebouncedSearch("");
                      setCurrentPage(1);
                    }}
                    aria-label={t("orders.clearSearch")}
                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={handleFilterChange(setStatusFilter)}
                  aria-label={t("orders.filterStatusAria")}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3.5 py-2 outline-none focus:border-indigo-500 cursor-pointer transition-all hover:border-slate-300"
                >
                  <option value="">{t("orders.allStatus")}</option>
                  {Object.entries(STATUS_CONFIG).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {t(`orders.${value}`) || label}
                    </option>
                  ))}
                </select>

                <select
                  value={paymentFilter}
                  onChange={handleFilterChange(setPaymentFilter)}
                  aria-label={t("orders.filterPaymentAria")}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3.5 py-2 outline-none focus:border-indigo-500 cursor-pointer transition-all hover:border-slate-300"
                >
                  <option value="">{t("orders.allPayment")}</option>
                  <option value="paid">{t("orders.paid")}</option>
                  <option value="unpaid">{t("orders.unpaid")}</option>
                </select>

                <select
                  value={methodFilter}
                  onChange={handleFilterChange(setMethodFilter)}
                  aria-label={t("orders.filterMethodAria")}
                  className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3.5 py-2 outline-none focus:border-indigo-500 cursor-pointer transition-all hover:border-slate-300"
                >
                  <option value="">{t("orders.allMethods")}</option>
                  <option value="cash">{t("orders.cash")}</option>
                  <option value="card">{t("orders.card")}</option>
                </select>

                {(statusFilter ||
                  paymentFilter ||
                  methodFilter ||
                  searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    {t("orders.resetFilters")}
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div
              className={`overflow-x-auto transition-opacity duration-150 ${
                loading ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <table className="w-full text-left rtl:text-right border-collapse text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-semibold text-xs tracking-wider uppercase">
                  <tr>
                    <th className="py-3.5 px-6">{t("orders.orderId")}</th>
                    <th className="py-3.5 px-6">{t("orders.customer")}</th>
                    <th className="py-3.5 px-6">{t("orders.date")}</th>
                    <th className="py-3.5 px-6">{t("orders.status")}</th>
                    <th className="py-3.5 px-6">{t("orders.payment")}</th>
                    <th className="py-3.5 px-6">{t("orders.total")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {error && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-rose-500">
                          <AlertCircle className="w-8 h-8" />
                          <p className="font-medium">{error}</p>
                          <button
                            onClick={() =>
                              fetchOrders(new AbortController().signal)
                            }
                            className="mt-2 text-xs text-indigo-600 underline font-semibold cursor-pointer"
                          >
                            {t("common.tryAgain")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!error && orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <Package className="w-8 h-8 stroke-1" />
                          <p className="font-medium text-slate-500">
                            {t("orders.noOrders")}
                          </p>
                          <p className="text-xs">
                            {t("orders.adjustFiltersHint")}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!error &&
                    orders.map((order) => {
                      const statusKey =
                        order.status?.toLowerCase() || "pending";
                      const statusInfo =
                        STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                      const isPaid =
                        order.isPaid || order.paymentStatus === "paid";

                      return (
                        <tr
                          key={order._id || order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-surface-hover/70 transition-colors duration-150 cursor-pointer group"
                        >
                          <td className="py-4 px-6 font-semibold text-indigo-600 group-hover:underline">
                            #
                            {order._id
                              ? order._id.slice(-8).toUpperCase()
                              : order.id || t("orders.na")}
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase shrink-0">
                                {order.user?.name
                                  ? order.user.name.charAt(0)
                                  : order.shippingAddress?.fullName
                                  ? order.shippingAddress.fullName.charAt(0)
                                  : "U"}
                              </div>
                              <span className="font-medium text-slate-800 line-clamp-1">
                                {order.user?.name ||
                                  order.shippingAddress?.fullName ||
                                  t("orders.customer")}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-slate-500 text-xs">
                            {formatDate(order.createdAt)}
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {t(`orders.${statusKey}`) || statusInfo.label}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                  isPaid
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {isPaid ? t("orders.paid") : t("orders.unpaid")}
                              </span>
                              <span className="text-[11px] text-slate-400 capitalize">
                                {order.paymentMethodType?.toLowerCase() === "card"
                                  ? t("orders.card")
                                  : order.paymentMethodType?.toLowerCase() === "cash"
                                  ? t("orders.cash")
                                  : order.paymentMethodType ||
                                    order.paymentMethod ||
                                    t("orders.cash")}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6 font-semibold text-slate-900">
                            {formatCurrency(getOrderTotal(order))}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 text-sm flex flex-wrap gap-4 items-center justify-between border-t border-slate-100 text-slate-500">
                <div>
                  {t("orders.showingPage", {
                    current: currentPage,
                    total: totalPages,
                  })}
                </div>

                <div className="flex gap-1 items-center">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    aria-label={t("orders.prevPage")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  </button>

                  {pageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      aria-label={t("orders.goToPage", { page: num })}
                      aria-current={num === currentPage ? "page" : undefined}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border cursor-pointer text-xs font-semibold transition-colors ${
                        num === currentPage
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    aria-label={t("orders.nextPage")}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer */}
          <OrderDetailsDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdated={handleOrderUpdated}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Orders;