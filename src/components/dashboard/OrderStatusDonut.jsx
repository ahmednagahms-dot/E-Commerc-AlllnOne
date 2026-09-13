import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = { pending: "#f59e0b", confirmed: "#6366f1", processing: "#eab308", shipped: "#3b82f6", delivered: "#22c55e", cancelled: "#ef4444", returned: "#94a3b8" };

export default function OrderStatusDonut({ data }) {
  const { t } = useTranslation();
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{t("dashboard.ordersByStatus")}</h3>
        <span className="text-xs text-gray-400">{t("dashboard.thisPeriod")}</span>
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={45} outerRadius={70} paddingAngle={2}>
              {data.map((d, i) => <Cell key={i} fill={COLORS[d.status] || "#ccc"} />)}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" wrapperStyle={{ fontSize: 10, textTransform: "capitalize" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ width: "55%" }}>
          <p className="text-lg font-bold">{total}</p>
          <p className="text-xs text-gray-400">{t("common.total")}</p>
        </div>
      </div>
    </div>
  );
}