import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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
}

// ─── РАСЧЁТ ДАТЫ ДОСТАВКИ ─────────────────────────────────────────────────────
function getDeliveryInfo(createdAt: string, address: any) {
  const country = address?.address?.country || address?.country || "AM";
  const city    = address?.address?.city    || address?.city    || "";

  let days: number;
  let zone: string;

  if (country === "AM") {
    const isYerevan = city.toLowerCase().includes("yerevan") || city.toLowerCase().includes("երևան");
    if (isYerevan) {
      days = 7;
      zone = "Yerevan";
    } else {
      days = 10;
      zone = "Armenia (regions)";
    }
  } else if (["RU", "UA", "GE", "BY", "KZ", "AZ"].includes(country)) {
    days = 21;
    zone = "CIS";
  } else {
    days = 30;
    zone = "International";
  }

  const orderDate   = new Date(createdAt);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + days);

  const today = new Date();
  const isLate = today > deliveryDate && !["delivered", "cancelled"].includes("status");

  return {
    date: deliveryDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
    days,
    zone,
    isLate,
  };
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    pending:    { label: "Pending",    color: "text-yellow-700", bg: "bg-yellow-50"  },
    paid:       { label: "Paid",       color: "text-blue-700",   bg: "bg-blue-50"    },
    processing: { label: "Processing", color: "text-purple-700", bg: "bg-purple-50"  },
    shipped:    { label: "Shipped",    color: "text-orange-700", bg: "bg-orange-50"  },
    delivered:  { label: "Delivered",  color: "text-green-700",  bg: "bg-green-50"   },
    cancelled:  { label: "Cancelled",  color: "text-red-700",    bg: "bg-red-50"     },
  };
  const s = config[status] || { label: status, color: "text-gray-700", bg: "bg-gray-50" };
  return (
    <span className={`text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 ${s.bg} ${s.color}`}>
      {s.label}
    </span>
  );
}

// ─── PROGRESS TRACKER ─────────────────────────────────────────────────────────
function OrderProgress({ status }: { status: string }) {
  const steps = ["paid", "processing", "shipped", "delivered"];
  const currentIndex = steps.indexOf(status);
  if (status === "cancelled" || status === "pending") return null;

  return (
    <div className="flex items-start gap-0 mt-4 mb-2">
      {steps.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isCurrent   = i === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                isCompleted ? "bg-black border-black" : "bg-white border-gray-200"
              } ${isCurrent ? "ring-2 ring-black ring-offset-2" : ""}`}/>
              <span className={`text-[8px] uppercase tracking-wider hidden md:block text-center ${
                isCompleted ? "text-black font-bold" : "text-gray-300"
              }`}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mb-5 transition-colors ${
                i < currentIndex ? "bg-black" : "bg-gray-200"
              }`}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DELIVERY ESTIMATE ────────────────────────────────────────────────────────
function DeliveryEstimate({ order }: { order: Order }) {
  if (order.status === "delivered" || order.status === "cancelled") return null;

  const info = getDeliveryInfo(order.created_at, order.shipping_address);

  return (
    <div className="mx-6 mb-4 border border-gray-100 bg-gray-50 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 shrink-0">
          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Estimated Delivery</p>
          <p className="text-xs font-bold">By {info.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Zone</p>
          <p className="text-[10px] font-bold uppercase tracking-wider">{info.zone}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Max Days</p>
          <p className="text-[10px] font-bold">{info.days} days</p>
        </div>
      </div>
    </div>
  );
}

// ─── СТРАНИЦА ─────────────────────────────────────────────────────────────────
export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, status, total, payment_method, created_at, shipping_address,
      order_items ( id, product_name, price, quantity, size )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const orderList = (orders || []) as Order[];

  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ШАПКА */}
      <div className="border-b border-black px-6 md:px-12 py-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/account"
            className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1 mb-3">
            ← Back to Account
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">VEH / Account</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">My Orders</h1>
        </div>
        <span className="text-sm text-gray-400 font-mono">{orderList.length} order{orderList.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ЗОНЫ ДОСТАВКИ */}
      <div className="border-b border-black bg-[#0D0D0D] text-white px-6 md:px-12 py-8">
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-6">Shipping Zones</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* YEREVAN */}
          <div className="flex flex-col gap-4 p-5 border border-white/30 bg-white/[0.06]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-0.5">Yerevan</p>
              <p className="text-[9px] uppercase tracking-widest text-white/25 mb-3">Armenia</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Up to 7 days</p>
            </div>
          </div>

          {/* ARMENIA — карта */}
          <div className="flex flex-col gap-4 p-5 border border-white/10 hover:border-white/20 transition-colors">
            <img
              src="/armeniamap.svg"
              alt="Armenia"
              width={24}
              height={20}
              style={{ filter: "invert(1) opacity(0.4)", objectFit: "contain", height: "26px", width: "auto" }}
            />
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-0.5">Armenia</p>
              <p className="text-[9px] uppercase tracking-widest text-white/25 mb-3">Regions</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Up to 10 days</p>
            </div>
          </div>

          {/* CIS */}
          <div className="flex flex-col gap-4 p-5 border border-white/10 hover:border-white/20 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-0.5">CIS</p>
              <p className="text-[9px] uppercase tracking-widest text-white/25 mb-3">Russia · Ukraine · GE</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Up to 21 days</p>
            </div>
          </div>

          {/* INTERNATIONAL */}
          <div className="flex flex-col gap-4 p-5 border border-white/10 hover:border-white/20 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <line x1="12" y1="2" x2="12" y2="22"/><path d="M2 12h20"/><path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
            </svg>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-0.5">International</p>
              <p className="text-[9px] uppercase tracking-widest text-white/25 mb-3">Europe · USA · World</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Up to 30 days</p>
            </div>
          </div>

        </div>
      </div>

      {/* СПИСОК */}
      <div className="px-6 md:px-12 py-10">
        {orderList.length === 0 ? (
          <div className="border border-dashed border-gray-200 py-24 flex flex-col items-center justify-center text-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200 mb-4">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className="text-xs text-gray-300 uppercase tracking-widest mb-6">No orders yet</p>
            <Link href="/shop"
              className="bg-black text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orderList.map(order => (
              <div key={order.id} className="border border-gray-100 hover:border-black transition-colors">

                {/* ШАПКА ЗАКАЗА */}
                <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Order</p>
                      <p className="text-xs font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-100"/>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Date</p>
                      <p className="text-xs font-bold">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-100"/>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Total</p>
                      <p className="text-xs font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-gray-100"/>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Items</p>
                      <p className="text-xs font-bold">{order.order_items?.length || 0} piece{(order.order_items?.length || 0) !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* ПРОГРЕСС */}
                <div className="px-6 pt-4">
                  <OrderProgress status={order.status} />
                </div>

                {/* ДАТА ДОСТАВКИ */}
                <DeliveryEstimate order={order} />

                {/* ТОВАРЫ */}
                <div className="px-6 py-4">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-3">Items</p>
                  <div className="flex flex-col gap-3">
                    {order.order_items?.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-gray-100 shrink-0 flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-tight">{item.product_name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                            Size: {item.size} · Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* АДРЕС */}
                {order.shipping_address && (
                  <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-2">Shipping to</p>
                    <p className="text-xs text-gray-600">
                      {[
                        order.shipping_address?.name,
                        order.shipping_address?.address?.line1,
                        order.shipping_address?.address?.city,
                        order.shipping_address?.address?.country,
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}

                {/* ФУТЕР */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest text-gray-300">
                    Paid via {order.payment_method || "Card"}
                  </span>
                  {order.status === "shipped" && (
                    <button className="text-[9px] uppercase tracking-widest font-bold border-b border-black hover:opacity-50 transition-opacity">
                      Track Shipment →
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <span className="text-[9px] uppercase tracking-widest text-green-600 font-bold">✓ Delivered</span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}