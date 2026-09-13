import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../components/layout/DashboardLayout";

import PageLoader from "../components/ui/sessionLoader/PageLoader";



import StatCard from "../components/dashboard/StatCard";
import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import TopProductsList from "../components/dashboard/TopProductsList";
import OrderStatusDonut from "../components/dashboard/OrderStatusDonut";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";

import {
  months,
  getAvailableYears,
  getPreviousPeriod,
  filterByPeriod,
  calcGrowth,
  buildSeries,
  buildTopProducts,
  buildOrderStatusBreakdown,
} from "../data/dashboardData";

import api from "../api/axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("All");

  const fetchAll = async (showSuccessToast = false) => {
    try {
      setLoading(true);
      setError(null);

      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get("/orders/admin?limit=1000"),
        api.get("/products?limit=500"),
        api.get("/users/all"),
      ]);

      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);

      setCustomers(

        (usersRes.data.users || []).filter((user) => user.role === "customer"),

        (usersRes.data.users || []).filter((user) => user.role === "customer")

      );

      if (showSuccessToast) {
        toast.success("Dashboard data refreshed successfully.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);

      setError("Failed to load dashboard data.");

      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAll();
  }, []);

  const availableYears = useMemo(() => {
    const years = getAvailableYears(orders);
    const currentYear = new Date().getFullYear();

    return years.includes(currentYear) ? years : [currentYear, ...years];
  }, [orders]);

  const data = useMemo(() => {
    const periodOrders = filterByPeriod(orders, "createdAt", year, month);

    const prev = getPreviousPeriod(year, month);

    const prevOrders = filterByPeriod(
      orders,
      "createdAt",
      prev.year,
      prev.month,
      prev.month
    );

    const periodCustomers = filterByPeriod(customers, "createdAt", year, month);

    const prevCustomers = filterByPeriod(
      customers,
      "createdAt",
      prev.year,
      prev.month,
      prev.month

    );

    const periodProducts = filterByPeriod(products, "createdAt", year, month);

    const prevProducts = filterByPeriod(
      products,
      "createdAt",
      prev.year,
      prev.month,
      prev.month

    );

    // Exclude cancelled orders from revenue
    const validOrders = periodOrders.filter(
      (order) => order.status !== "cancelled",
    );

    const prevValidOrders = prevOrders.filter(
      (order) => order.status !== "cancelled",
      (order) => order.status !== "cancelled"
    );

    const prevValidOrders = prevOrders.filter(
      (order) => order.status !== "cancelled"
    );

    const revenue = validOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
      0
    );

    const prevRevenue = prevValidOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
      0
    );

    const revenueSeries = buildSeries(
      orders,
      "createdAt",
      (order) => Number(order.totalPrice || 0),
      year,
      month,
      month
    );

    const ordersSeries = buildSeries(orders, "createdAt", () => 1, year, month);

    const customersSeries = buildSeries(
      customers,
      "createdAt",
      () => 1,
      year,
      month,
      month
    );

    const productsSeries = buildSeries(
      products,
      "createdAt",
      () => 1,
      year,
      month,
      month
    );

    return {
      stats: [
        {
          title: "Total Revenue",
          value: `$${revenue.toLocaleString()}`,
          growth: calcGrowth(revenue, prevRevenue),
          icon: "Wallet",
          color: "blue",
          sparkData: revenueSeries,
        },
        {
          title: "Total Orders",
          value: periodOrders.length.toLocaleString(),
          growth: calcGrowth(periodOrders.length, prevOrders.length),
          icon: "ShoppingBag",
          color: "green",
          sparkData: ordersSeries,
        },
        {
          title: "Total Customers",
          value: customers.length.toLocaleString(),
          growth: calcGrowth(periodCustomers.length, prevCustomers.length),
          icon: "Users",
          color: "purple",
          sparkData: customersSeries,
        },
        {
          title: "Total Products",
          value: products.length.toLocaleString(),
          growth: calcGrowth(periodProducts.length, prevProducts.length),
          icon: "Package",
          color: "orange",
          sparkData: productsSeries,
        },
      ],

      salesData: {
        revenue: revenueSeries,
        orders: ordersSeries,
      },

      topProducts: buildTopProducts(periodOrders),

      statusBreakdown: buildOrderStatusBreakdown(periodOrders),
    };
  }, [orders, products, customers, year, month]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orders],
    [orders]
  );

  const recentActivity = useMemo(() => {
    const list = [];

    recentOrders.slice(0, 3).forEach((order) => {
      list.push({
        id: `o-${order._id}`,
        icon: "ShoppingBag",
        color: "blue",
        title: `New order from ${
          order.shippingAddress?.fullName || "a customer"
        }`,
        date: order.createdAt,
      });
    });

    [...products]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 2)
      .forEach((product) => {
        list.push({
          id: `p-${product._id}`,
          icon: "Package",
          color: "purple",
          title: `Product "${product.name}" updated`,
          date: product.updatedAt,
        });
      });

    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [recentOrders, products]);

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text="Loading dashboard..." />
      ) : (
        <div className="p-4 sm:p-6 w-full animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>

              <p className="text-sm text-gray-500">
                Real-time overview of your store's performance.
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                onClick={() => fetchAll(true)}
                disabled={loading}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">
              Loading dashboard...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-danger">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {data.stats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <SalesOverviewChart data={data.salesData} />

                <TopProductsList products={data.topProducts} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <RecentOrdersTable orders={recentOrders} />

                <div className="flex flex-col gap-4">
                  <OrderStatusDonut data={data.statusBreakdown} />
                </div>
              </div>

              <div className="mt-4">
                <RecentActivityFeed activities={recentActivity} />
              </div>
            </>
          )}
        </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <p className="text-sm text-gray-500">
            Real-time overview of your store's performance.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchAll(true)}
            disabled={loading}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          Loading dashboard...
        </div>
      ) : error ? (
        <div className="text-center py-16 text-danger">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {data.stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <SalesOverviewChart data={data.salesData} />

            <TopProductsList products={data.topProducts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RecentOrdersTable orders={recentOrders} />

            <div className="flex flex-col gap-4">
              <OrderStatusDonut data={data.statusBreakdown} />
            </div>
          </div>

          <div className="mt-4">
            <RecentActivityFeed activities={recentActivity} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
