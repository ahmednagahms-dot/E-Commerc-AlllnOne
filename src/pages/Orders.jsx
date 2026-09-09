import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/layout/DashboardLayout"

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // States الخاصة بالـ Drawer وتعديل حالة الطلب
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: currentPage,
          limit: 15,
          sort: "-createdAt",
        };

        if (searchTerm.trim()) params.keyword = searchTerm.trim();
        if (statusFilter) params.status = statusFilter;
        if (paymentFilter === "paid") params.isPaid = true;
        if (paymentFilter === "unpaid") params.isPaid = false;
        if (methodFilter) params.paymentMethodType = methodFilter;

        const response = await axios.get("/orders/admin", { params });

        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data.orders || data.data || data.result || [];

        setOrders(list);

        setTotalPages(
          data.paginationResult?.numberOfPages ||
            data.totalPages ||
            data.numOfPages ||
            Math.ceil((data.results || list.length) / 10) ||
            1
        );

        setTotalOrders(
          data.results || data.totalOrders || data.total || list.length || 0
        );
      } catch (err) {
        console.error("API Error:", err);
        if (err.response?.status === 401) {
          setError(
            "Unauthorized (401): Invalid or expired token, or user is not an Admin."
          );
        } else if (err.response?.status === 404) {
          setError("Endpoint Not Found (404)");
        } else {
          setError(
            err.response?.data?.message || "Failed to connect to the server."
          );
        }
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, paymentFilter, methodFilter]);

  // تحديث حالة الطلب
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const orderId = selectedOrder._id || selectedOrder.id;
      
      await axios.patch(`/orders/admin/${orderId}/status`, { status: newStatus });

      setOrders(prev =>
        prev.map(ord =>
          (ord._id === orderId || ord.id === orderId)
            ? { ...ord, status: newStatus }
            : ord
        )
      );

      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const pageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
     <DashboardLayout>
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
            Admin · Management
          </span>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md px-5 py-2 text-right">
          <span className="text-2xl font-bold text-gray-900">
            {totalOrders}
          </span>
          <span className="text-xs text-slate-400 pl-2 lowercase">
            total orders
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200/80 overflow-hidden mb-6">
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-200/80 flex flex-wrap gap-4 justify-between items-center">
          <div className="min-w-[280px] flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleFilterChange(setSearchTerm)}
              placeholder="Search ID, customer..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={handleFilterChange(setPaymentFilter)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">All Payment</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>

            <select
              value={methodFilter}
              onChange={handleFilterChange(setMethodFilter)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card / Stripe</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50/80 border-b border-gray-100 text-slate-400 font-medium text-xs tracking-wider uppercase">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Total</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-slate-700">
              {loading && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    Loading orders...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    No orders found
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                orders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewStatus(order.status || "pending");
                    }}
                    className="hover:bg-indigo-50/40 transition-colors duration-150 cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-semibold text-indigo-600 group-hover:underline">
                      #{order._id ? order._id.slice(-8) : order.id || "N/A"}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-100 uppercase">
                          {order.user?.name
                            ? order.user.name.charAt(0)
                            : order.shippingAddress?.fullName
                            ? order.shippingAddress.fullName.charAt(0)
                            : "U"}
                        </div>

                        <span className="font-medium text-slate-800">
                          {order.user?.name ||
                            order.shippingAddress?.fullName ||
                            "Customer"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        • {order.status || "Pending"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                          {order.isPaid || order.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>

                        <span className="text-[11px] text-slate-400 pl-0.5">
                          {order.paymentMethodType || order.paymentMethod || "Cash"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {(() => {
                        const price = order.totalOrderPrice || order.totalPrice || order.price || order.total || 0;
                        return typeof price === "number" ? price.toLocaleString() : Number(price || 0).toLocaleString();
                      })()}{" "}
                      EGP
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 text-sm flex flex-wrap gap-4 items-center justify-between border-t border-gray-100 text-slate-500">
          <div>
            page{" "}
            <span className="font-semibold text-indigo-700">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-indigo-700">
              {totalPages}
            </span>
          </div>

          <div className="flex gap-1 items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              &lt;
            </button>

            {pageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border cursor-pointer text-xs font-medium transition-colors duration-150 ${
                  num === currentPage
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "border-slate-200 text-slate-600 hover:bg-indigo-500 hover:text-white"
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
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer with Smooth Animation */}
      <div 
        className={`fixed inset-0 overflow-hidden z-50 transition-all duration-300 ${
          selectedOrder ? "visible opacity-100" : "invisible opacity-0 delay-300"
        }`}
      >
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 ${
            selectedOrder ? "opacity-100" : "opacity-0"
          }`} 
          onClick={() => setSelectedOrder(null)}
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div 
            className={`w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${
              selectedOrder ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">Order Detail</span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    #{selectedOrder?._id ? selectedOrder._id.slice(-8) : selectedOrder?.id}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 my-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60 shadow-xs">
                  {selectedOrder?.isPaid || selectedOrder?.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 shadow-xs">
                  {selectedOrder?.paymentMethodType || selectedOrder?.paymentMethod || "Cash"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/60 shadow-xs">
                  {selectedOrder?.status || "Pending"}
                </span>
              </div>

              {/* Info Box */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2.5 text-sm text-slate-600 my-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Placed Date</span>
                  <span className="font-semibold text-slate-800">{formatDate(selectedOrder?.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Customer</span>
                  <span className="font-semibold text-slate-800">
                    {selectedOrder?.user?.name || selectedOrder?.shippingAddress?.fullName || "Customer"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Email</span>
                  <span className="font-semibold text-slate-800 text-xs truncate max-w-[200px]">
                    {selectedOrder?.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-xs text-slate-400 font-medium">Ship to Address</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[210px]">
                    {selectedOrder?.shippingAddress?.city ? `${selectedOrder.shippingAddress.city} - ` : ""}
                    {selectedOrder?.shippingAddress?.address || "N/A"}
                  </span>
                </div>
                {selectedOrder?.shippingAddress?.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Phone</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.shippingAddress.phone}</span>
                  </div>
                )}
              </div>

              {/* Items Section (Robust Fallback) */}
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Order Items</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {(() => {
                  const itemsList = selectedOrder?.cartItems || selectedOrder?.items || selectedOrder?.orderItems || [];
                  
                  if (itemsList.length === 0) {
                    return (
                      <div className="text-center py-4 text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        No items found for this order
                      </div>
                    );
                  }

                  return itemsList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-white shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 overflow-hidden">
                          {item.product?.imageCover || item.imageCover || item.image ? (
                            <img 
                              src={item.product?.imageCover || item.imageCover || item.image} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-xs line-clamp-1 max-w-[180px]">
                            {item.product?.title || item.title || item.name || "Product"}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">Qty: {item.quantity || 1}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString()} EGP
                      </span>
                    </div>
                  ));
                })()}
              </div>

              {/* Update Status Section */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Totals & Actions */}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span>{(selectedOrder?.totalOrderPrice || selectedOrder?.totalPrice || 0).toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-dashed border-slate-200">
                  <span className="font-bold text-slate-800">Total Amount</span>
                  <span className="font-extrabold text-indigo-600 text-base">
                    {(selectedOrder?.totalOrderPrice || selectedOrder?.totalPrice || 0).toLocaleString()} EGP
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-1/3 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-2/3 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Orders;