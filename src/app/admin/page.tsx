import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";

const ADMIN_EMAIL = "vehbrand@gmail.com";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ─── ЗАЩИТА — только admin ────────────────────────────────────────────────
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  // ─── ЗАГРУЖАЕМ ВСЕ ЗАКАЗЫ ────────────────────────────────────────────────
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, status, total, payment_method, created_at, shipping_address,
      order_items ( id, product_name, price, quantity, size )
    `)
    .order("created_at", { ascending: false });

  // Загружаем профили отдельно
  const allOrders = orders || [];
  const userIds = [...new Set(allOrders.map((o: any) => o.user_id).filter(Boolean))];
  
  let profilesMap: Record<string, { full_name: string; email: string }> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    
    (profiles || []).forEach(p => {
      profilesMap[p.id] = { full_name: p.full_name, email: p.email };
    });
  }

  const ordersWithProfiles = allOrders.map(o => ({
    ...o,
    profiles: profilesMap[(o as any).user_id] || null,
  }));
  const totalRev   = ordersWithProfiles.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const paid       = ordersWithProfiles.filter(o => o.status === "paid").length;
  const shipped    = ordersWithProfiles.filter(o => o.status === "shipped").length;
  const delivered  = ordersWithProfiles.filter(o => o.status === "delivered").length;

  return (
    <AdminClient
      orders={ordersWithProfiles as any}
      stats={{ total: ordersWithProfiles.length, revenue: totalRev, paid, shipped, delivered }}
    />
  );
}