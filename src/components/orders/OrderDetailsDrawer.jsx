import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Package,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function OrderDetailsDrawer({ order, onClose, onUpdated }) {
  const { t, i18n } = useTranslation();
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const isOpen = Boolean(order);

  const STATUS_OPTIONS = [
    { value: "pending", label: t("orders.pending") },
    { value: "confirmed", label: t("orders.confirmed") },
    { value: "processing", label: t("orders.processing") },
    { value: "shipped", label: t("orders.shipped") },
    { value: "delivered", label: t("orders.delivered") },
    { value: "cancelled", label: t("orders.cancelled") },
  ];

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return t("orders.currency", { amount: num.toFixed(2) });
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("orders.na");
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t("orders.na");

    return date.toLocaleDateString(
      i18n.language === "ar" ? "ar-EG" : "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Sync local state when order changes
  useEffect(() => {
    if (order) {
      setNewStatus(order.status || "pending");
      setAdminNote(order.adminNote || "");
    }
  }, [order]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleUpdateStatus = async () => {
    if (!order) return;

    try {
      setUpdating(true);
      const orderId = order._id || order.id;

      // ✅ ابعت الـ note بس لو فيها قيمة
      const payload = { status: newStatus };
      if (adminNote.trim()) payload.note = adminNote.trim();

      await api.patch(`/orders/admin/${orderId}/status`, payload);

      toast.success(t("orders.statusUpdatedSuccess"));

      // إبلاغ الصفحة الأم إنه اتعمل update
      if (typeof onUpdated === "function") {
        onUpdated(orderId, { status: newStatus, adminNote });
      }

      onClose();
    } catch (err) {
      console.error("Failed to update status:", err);

      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : t("orders.statusUpdateFailed"));

      toast.error(serverMsg);
    } finally {
      setUpdating(false);
    }
  };

  /* ---------- Derived ---------- */

  const orderId = order?._id || order?.id;
  const shortId = orderId ? orderId.slice(-8).toUpperCase() : t("orders.na");
  const isPaid = order?.isPaid || order?.paymentStatus === "paid";

  const statusKey = order?.status?.toLowerCase() || "pending";
  const statusLabel =
    STATUS_OPTIONS.find((s) => s.value === statusKey)?.label || t("orders.pending");

  const getPaymentMethodLabel = (method) => {
    const m = (method || "").toLowerCase();
    if (m === "cash") return t("orders.cash");
    if (m === "card" || m === "stripe") return t("orders.card");
    return method || t("orders.cash");
  };

  const itemsList =
    order?.cartItems || order?.items || order?.orderItems || [];

  const subtotal =
    order?.subtotal ||
    itemsList.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  const shipping = order?.shippingPrice || 0;
  const tax = order?.taxPrice || 0;
  const total =
    order?.totalOrderPrice ||
    order?.totalPrice ||
    order?.total ||
    subtotal + shipping + tax;

  return (
    <div
      className={`fixed inset-0 overflow-hidden z-50 transition-all duration-300 ${
        isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div
          className={`w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {!order ? null : (
            <>
              {/* ---------- Header ---------- */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    {t("orders.detail")}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    #{shortId}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  aria-label={t("common.close")}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ---------- Badges ---------- */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    {statusLabel}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isPaid ? t("orders.paid") : t("orders.pending")}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400 capitalize">
                  {getPaymentMethodLabel(order?.paymentMethodType || order?.paymentMethod)}
                </span>
              </div>

              {/* ---------- Info ---------- */}
              <div className="mb-6">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t("orders.info")}
                </span>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 text-sm">
                  <InfoRow label={t("orders.placedDate")} value={formatDate(order?.createdAt)} />

                  <InfoRow
                    label={t("orders.customer")}
                    value={
                      <span className="flex items-center gap-1">
                        {order?.user?.name ||
                          order?.shippingAddress?.fullName ||
                          "—"}
                        <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </span>
                    }
                  />

                  <InfoRow
                    label={t("orders.email")}
                    value={order?.user?.email || "—"}
                  />

                  <InfoRow
                    label={t("orders.shipAddress")}
                    value={
                      [
                        order?.shippingAddress?.city,
                        order?.shippingAddress?.address,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"
                    }
                  />
                </div>
              </div>

              {/* ---------- Items ---------- */}
              <div className="mb-6">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  {t("orders.itemsWithCount", { count: itemsList.length })}
                </span>

                {itemsList.length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4">
                    {t("orders.noItems")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {itemsList.map((item, idx) => (
                      <OrderItem key={idx} item={item} formatCurrency={formatCurrency} />
                    ))}
                  </div>
                )}
              </div>

              {/* ---------- Totals ---------- */}
              <div className="mb-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 text-sm">
                  <InfoRow
                    label={t("orders.subtotal")}
                    value={formatCurrency(subtotal)}
                    muted
                  />
                  <InfoRow
                    label={t("orders.shipping")}
                    value={shipping > 0 ? formatCurrency(shipping) : t("orders.free")}
                    muted
                  />
                  <InfoRow
                    label={t("orders.tax")}
                    value={formatCurrency(tax)}
                    muted
                  />
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-900">{t("orders.total")}</span>
                    <span className="font-bold text-base text-slate-900">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ---------- Update Status ---------- */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t("orders.updateStatus")}
                </span>

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl p-3 outline-none focus:border-slate-400 cursor-pointer transition-all"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={t("orders.adminNotePlaceholder")}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all resize-none min-h-[90px]"
                />

                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 text-sm mt-2"
                >
                  {updating ? t("common.saving") : t("orders.saveChanges")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function InfoRow({ label, value, muted = false }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className={muted ? "text-slate-500" : "text-slate-400"}>
        {label}
      </span>
      <span
        className={`${
          muted ? "font-semibold text-slate-900" : "font-semibold text-slate-900"
        } text-end`}
      >
        {value}
      </span>
    </div>
  );
}

function OrderItem({ item, formatCurrency }) {
  const { t } = useTranslation();
  const title = item.product?.title || item.title || item.name || t("reviews.product");
  const image = item.product?.imageCover || item.imageCover || item.image;
  const price = item.price || 0;
  const quantity = item.quantity || 1;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-6 h-6 text-cyan-400" />
          )}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            × {quantity} · {formatCurrency(price)}
          </p>
        </div>
      </div>
      <span className="font-bold text-slate-900 text-sm shrink-0">
        {formatCurrency(price * quantity)}
      </span>
    </div>
  );
}