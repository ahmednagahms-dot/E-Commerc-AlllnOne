import * as Icons from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Sparkline from "./Sparkline";

const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", line: "#3b82f6" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600", line: "#10b981" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", line: "#a855f7" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", line: "#f97316" },
};

export default function StatCard({ title, value, growth, icon, color, sparkData }) {
  const Icon = Icons[icon];
  const c = colorMap[color];
  const isPositive = growth >= 0;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>
          {Icon && <Icon size={18} />}
        </div>
        <Icons.MoreHorizontal size={16} className="text-gray-300" />
      </div>

      <p className="text-sm text-gray-500 mt-2">{title}</p>
      <h3 className="text-2xl font-bold mt-0.5">{value}</h3>

      <div className="flex items-center gap-1 mt-1.5 text-xs">
        {isPositive ? (
          <TrendingUp size={13} className="text-success" />
        ) : (
          <TrendingDown size={13} className="text-danger" />
        )}
        <span className={isPositive ? "text-success" : "text-danger"}>
          {isPositive ? "+" : ""}{growth}%
        </span>
        <span className="text-gray-400">vs last period</span>
      </div>

      <div className="mt-2 -mx-1">
        <Sparkline data={sparkData} color={c.line} />
      </div>
    </div>
  );
}