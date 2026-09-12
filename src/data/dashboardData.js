export const months = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function getAvailableYears(orders) {
  const years = new Set(orders.map((o) => new Date(o.createdAt).getFullYear()));
  years.add(new Date().getFullYear());
  return Array.from(years).sort((a, b) => b - a);
}

function isInPeriod(dateString, year, month) {
  const d = new Date(dateString);
  if (d.getFullYear() !== year) return false;
  if (month === "All") return true;
  return d.getMonth() === months.indexOf(month) - 1;
}

export function getPreviousPeriod(year, month) {
  if (month === "All") return { year: year - 1, month: "All" };
  const idx = months.indexOf(month) - 1;
  if (idx === 0) return { year: year - 1, month: "December" };
  return { year, month: months[idx] };
}

export function filterByPeriod(items, dateField, year, month) {
  return items.filter((i) => isInPeriod(i[dateField], year, month));
}

export function calcGrowth(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// يبني سلسلة زمنية مبسطة (بالشهور لو "All"، بالأسابيع لو شهر محدد) لأي مجموعة بيانات
export function buildSeries(items, dateField, valueFn, year, month) {
  const buckets = {};

  if (month === "All") {
    months.slice(1).forEach((m) => (buckets[m.slice(0, 3)] = 0));
    items.forEach((item) => {
      const d = new Date(item[dateField]);
      if (d.getFullYear() !== year) return;
      const key = months[d.getMonth() + 1].slice(0, 3);
      buckets[key] += valueFn(item);
    });
  } else {
    for (let w = 1; w <= 5; w++) buckets[`W${w}`] = 0;
    items.forEach((item) => {
      const d = new Date(item[dateField]);
      if (!isInPeriod(item[dateField], year, month)) return;
      const week = Math.min(5, Math.ceil(d.getDate() / 7));
      buckets[`W${week}`] += valueFn(item);
    });
  }

  return Object.entries(buckets).map(([label, value]) => ({ label, value }));
}

export function buildTopProducts(periodOrders) {
  const map = {};
  periodOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!map[item.product]) map[item.product] = { name: item.name, image: item.image, sold: 0, revenue: 0 };
      map[item.product].sold += item.quantity;
      map[item.product].revenue += item.price * item.quantity;
    });
  });
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

export function buildOrderStatusBreakdown(periodOrders) {
  const map = {};
  periodOrders.forEach((o) => {
    map[o.status] = (map[o.status] || 0) + 1;
  });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
}

export function formatRelativeTime(dateString) {
  const diffMins = Math.floor((new Date() - new Date(dateString)) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}