"use client";
import { useState } from "react";
import Link from "next/link";

// ─── ТИПЫ ─────────────────────────────────────────────────────────────────────
interface OrderItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  payment_method: string;
  created_at: string;
  shipping_address: any;
  order_items: OrderItem[];
  profiles: { full_name: string; email: string } | null;
}

interface Stats {
  total: number;
  revenue: number;
  paid: number;
  shipped: number;
  delivered: number;
}

const STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending:    "text-yellow-600 bg-yellow-50 border-yellow-200",
  paid:       "text-blue-600   bg-blue-50   border-blue-200",
  processing: "text-purple-600 bg-purple-50 border-purple-200",
  shipped:    "text-orange-600 bg-orange-50 border-orange-200",
  delivered:  "text-green-600  bg-green-50  border-green-200",
  cancelled:  "text-red-600    bg-red-50    border-red-200",
};

// ─── UPDATE STATUS ────────────────────────────────────────────────────────────
async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch("/api/admin/update-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, status }),
  });
  return res.ok;
}

// ─── STATUS SELECT ────────────────────────────────────────────────────────────
function StatusSelect({ orderId, current, onUpdate }: {
  orderId: string;
  current: string;
  onUpdate: (id: string, status: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setLoading(true);
    const ok = await updateOrderStatus(orderId, newStatus);
    if (ok) onUpdate(orderId, newStatus);
    setLoading(false);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1.5 border cursor-pointer outline-none disabled:opacity-50 ${STATUS_COLORS[current] || "text-gray-600 bg-gray-50 border-gray-200"}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
      ))}
    </select>
  );
}

// ─── ADMIN CLIENT ─────────────────────────────────────────────────────────────
export default function AdminClient({ orders: initialOrders, stats }: {
  orders: Order[];
  stats: Stats;
}) {
  const [orders,      setOrders]      = useState(initialOrders);
  const [filter,      setFilter]      = useState("all");
  const [search,      setSearch]      = useState("");
  const [expandedId,  setExpandedId]  = useState<string | null>(null);

  function handleStatusUpdate(id: string, status: string) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  // Фильтрация
  let filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  if (search) {
    filtered = filtered.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white pt-16">

      {/* ── ШАПКА ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-2">VEH / Admin</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">Orders</h1>
        </div>
        <Link href="/"
          className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-4 py-2 w-fit">
          ← Back to Site
        </Link>
      </div>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 border-b border-white/10">
        {[
          { label: "Total Orders",  value: stats.total,                  suffix: "" },
          { label: "Revenue",       value: `$${stats.revenue.toFixed(0)}`, suffix: "" },
          { label: "Awaiting",      value: stats.paid,                   suffix: " new" },
          { label: "Shipped",       value: stats.shipped,                suffix: "" },
          { label: "Delivered",     value: stats.delivered,              suffix: "" },
        ].map((s, i) => (
          <div key={s.label} className={`px-6 py-6 border-r border-white/10 ${i === 4 ? "md:border-r-0" : ""} ${i >= 2 ? "border-t md:border-t-0 border-white/10" : ""}`}>
            <p className="text-[9px] uppercase tracking-widest text-white/30 mb-2">{s.label}</p>
            <p className="text-2xl md:text-3xl font-black">{s.value}{s.suffix}</p>
          </div>
        ))}
      </div>

      {/* ── FILTERS + SEARCH ──────────────────────────────────────────────── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-0 overflow-x-auto">
          {["all", ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold border-r border-white/10 whitespace-nowrap transition-colors ${
                filter === s ? "bg-white text-black" : "text-white/40 hover:text-white"
              }`}>
              {s === "all" ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by name, email, order ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 px-4 py-2 text-xs outline-none placeholder:text-white/20 text-white w-full md:w-64 focus:border-white/30 transition-colors"
        />
      </div>

      {/* ── ORDERS TABLE ──────────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[10px] uppercase tracking-widest text-white/20">No orders found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(order => (
              <div key={order.id} className="border border-white/10 hover:border-white/20 transition-colors">

                {/* ORDER ROW */}
                <div
                  className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  {/* ID + DATE */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="shrink-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Order</p>
                      <p className="text-xs font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/10"/>
                    <div className="shrink-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Date</p>
                      <p className="text-xs font-bold">
                        {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/10"/>
                    {/* CUSTOMER */}
                    <div className="shrink-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Customer</p>
                      <p className="text-xs font-bold">{order.profiles?.full_name || "Guest"}</p>
                      <p className="text-[9px] text-white/30">{order.profiles?.email || "—"}</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/10"/>
                    {/* ITEMS */}
                    <div className="shrink-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Items</p>
                      <p className="text-xs font-bold">{order.order_items?.length || 0} pcs</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/10"/>
                    {/* TOTAL */}
                    <div className="shrink-0">
                      <p className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Total</p>
                      <p className="text-sm font-black">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* STATUS + EXPAND */}
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusSelect
                      orderId={order.id}
                      current={order.status}
                      onUpdate={handleStatusUpdate}
                    />
                    <span className={`text-white/30 transition-transform duration-200 ${expandedId === order.id ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </div>
                </div>

                {/* EXPANDED DETAILS */}
                {expandedId === order.id && (
                  <div className="border-t border-white/10 px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* ITEMS */}
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/30 mb-4">Order Items</p>
                      <div className="flex flex-col gap-3">
                        {order.order_items?.map(item => (
                          <div key={item.id} className="flex items-center gap-4 border-b border-white/5 pb-3">
                            <div className="w-10 h-12 bg-white/5 shrink-0 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
                                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold uppercase tracking-tight">{item.product_name}</p>
                              <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                                Size: {item.size} · Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                        <span className="text-[9px] uppercase tracking-widest text-white/30">Total</span>
                        <span className="text-base font-black">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* SHIPPING + INFO */}
                    <div className="flex flex-col gap-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-3">Ship To</p>
                        <div className="bg-white/5 border border-white/10 px-4 py-3">
                          {order.shipping_address ? (
                            <p className="text-xs text-white/80 leading-relaxed">
                              {[
                                order.shipping_address?.name,
                                order.shipping_address?.address?.line1,
                                order.shipping_address?.address?.city,
                                order.shipping_address?.address?.state,
                                order.shipping_address?.address?.postal_code,
                                order.shipping_address?.address?.country,
                              ].filter(Boolean).join(", ") || "—"}
                            </p>
                          ) : (
                            <p className="text-xs text-white/20">No address provided</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-3">Update Status</p>
                        <div className="grid grid-cols-3 gap-2">
                          {STATUSES.map(s => (
                            <button
                              key={s}
                              onClick={() => updateOrderStatus(order.id, s).then(ok => ok && handleStatusUpdate(order.id, s))}
                              className={`py-2 text-[9px] uppercase tracking-widest font-bold border transition-colors ${
                                order.status === s
                                  ? "bg-white text-black border-white"
                                  : "border-white/10 text-white/30 hover:border-white/30 hover:text-white"
                              }`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 mb-3">Order Info</p>
                        <div className="flex flex-col gap-2">
                          {[
                            { label: "Order ID",  value: order.id.slice(0, 8).toUpperCase() },
                            { label: "Payment",   value: order.payment_method || "Stripe" },
                            { label: "Created",   value: new Date(order.created_at).toLocaleString("en-US") },
                            { label: "Customer",  value: order.profiles?.full_name || "Guest" },
                            { label: "Email",     value: order.profiles?.email || order.shipping_address?.email || "—" },
                            {
                              label: "Delivery Deadline",
                              value: (() => {
                                const country = order.shipping_address?.address?.country || "—";
                                const city    = (order.shipping_address?.address?.city || "").toLowerCase();
                                let days = 30;
                                if (country === "AM") days = city.includes("yerevan") ? 7 : 10;
                                else if (["RU","UA","GE","BY","KZ","AZ"].includes(country)) days = 21;
                                const d = new Date(order.created_at);
                                d.setDate(d.getDate() + days);
                                return country === "—" ? "—" : `By ${d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })} (${days}d)`;
                              })()
                            },
                          ].map(item => (
                            <div key={item.label} className="flex justify-between border-b border-white/5 pb-2">
                              <span className="text-[9px] uppercase tracking-widest text-white/30">{item.label}</span>
                              <span className="text-[10px] font-bold text-right max-w-[60%]">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}