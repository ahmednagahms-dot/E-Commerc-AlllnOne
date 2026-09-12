import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import TopProductsList from "../components/dashboard/TopProductsList";
import OrderStatusDonut from "../components/dashboard/OrderStatusDonut";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import {
  months, getAvailableYears, getPreviousPeriod, filterByPeriod,
  calcGrowth, buildSeries, buildTopProducts, buildOrderStatusBreakdown,
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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get("/orders/admin?limit=1000"),
          api.get("/products?limit=500"),
          api.get("/users/all"),
        ]);
        setOrders(ordersRes.data.orders || []);
        setProducts(productsRes.data.products || []);
        setCustomers((usersRes.data.users || []).filter((u) => u.role === "customer"));
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const availableYears = useMemo(() => getAvailableYears(orders), [orders]);

  const data = useMemo(() => {
    const periodOrders = filterByPeriod(orders, "createdAt", year, month);
    const prev = getPreviousPeriod(year, month);
    const prevOrders = filterByPeriod(orders, "createdAt", prev.year, prev.month);

    const periodCustomers = filterByPeriod(customers, "createdAt", year, month);
    const prevCustomers = filterByPeriod(customers, "createdAt", prev.year, prev.month);

    const periodProducts = filterByPeriod(products, "createdAt", year, month);
    const prevProducts = filterByPeriod(products, "createdAt", prev.year, prev.month);

    const revenue = periodOrders.reduce((s, o) => s + o.totalPrice, 0);
    const prevRevenue = prevOrders.reduce((s, o) => s + o.totalPrice, 0);

    const revenueSeries = buildSeries(orders, "createdAt", (o) => o.totalPrice, year, month);
    const ordersSeries = buildSeries(orders, "createdAt", () => 1, year, month);
    const customersSeries = buildSeries(customers, "createdAt", () => 1, year, month);
    const productsSeries = buildSeries(products, "createdAt", () => 1, year, month);

    return {
      stats: [
        {
          title: "Total Revenue",
          value: `$${revenue.toLocaleString()}`,
          growth: calcGrowth(revenue, prevRevenue),
          icon: "Wallet", color: "blue", sparkData: revenueSeries,
        },
        {
          title: "Total Orders",
          value: periodOrders.length.toLocaleString(),
          growth: calcGrowth(periodOrders.length, prevOrders.length),
          icon: "ShoppingBag", color: "green", sparkData: ordersSeries,
        },
        {
          title: "Total Customers",
          value: customers.length.toLocaleString(),
          growth: calcGrowth(periodCustomers.length, prevCustomers.length),
          icon: "Users", color: "purple", sparkData: customersSeries,
        },
        {
          title: "Total Products",
          value: products.length.toLocaleString(),
          growth: calcGrowth(periodProducts.length, prevProducts.length),
          icon: "Package", color: "orange", sparkData: productsSeries,
        },
      ],
      salesData: { revenue: revenueSeries, orders: ordersSeries },
      topProducts: buildTopProducts(periodOrders),
      statusBreakdown: buildOrderStatusBreakdown(periodOrders),
    };
  }, [orders, products, customers, year, month]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [orders]
  );

  const recentActivity = useMemo(() => {
    const list = [];
    orders.slice(0, 3).forEach((o) =>
      list.push({ id: `o-${o._id}`, icon: "ShoppingBag", color: "blue", title: `New order from ${o.shippingAddress?.fullName || "a customer"}`, date: o.createdAt })
    );
    products.slice(0, 2).forEach((p) =>
      list.push({ id: `p-${p._id}`, icon: "Package", color: "purple", title: `Product "${p.name}" updated`, date: p.updatedAt })
    );
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, products]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time overview of your store's performance.</p>
        </div>

        <div className="flex gap-2">
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500">
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500">
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading dashboard...</div>
      ) : error ? (
        <div className="text-center py-16 text-danger">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {data.stats.map((s) => <StatCard key={s.title} {...s} />)}
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