import { Package } from "lucide-react";

export default function TopProductsList({ products }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Top Products</h3>
        <span className="text-xs text-primary-500">View all</span>
      </div>
      <div className="flex flex-col gap-4">
        {products.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No sales in this period.</p>
        ) : (
          products.map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Package size={16} className="text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.sold} sold</p>
              </div>
              <p className="text-sm font-semibold">${p.revenue.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}