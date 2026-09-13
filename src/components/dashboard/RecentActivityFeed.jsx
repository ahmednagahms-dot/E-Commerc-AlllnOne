import * as Icons from "lucide-react";
import { formatRelativeTime } from "../../data/dashboardData";
import { useTranslation } from "react-i18next";

const colorMap = { blue: "bg-blue-100 text-blue-600", green: "bg-emerald-100 text-emerald-600", purple: "bg-purple-100 text-purple-600" };

export default function RecentActivityFeed({ activities }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("dashboard.recentActivity")}</h3>
        <span className="text-xs text-primary-500">{t("common.viewAll")}</span>
      </div>
      <div className="flex flex-col gap-4">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">{t("dashboard.noActivity")}</p>
        ) : (
          activities.slice(0, 5).map((a) => {
            const Icon = Icons[a.icon] || Icons.Bell;
            return (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorMap[a.color]}`}>
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{a.title}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(a.date)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}