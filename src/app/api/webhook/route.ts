import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Service role — обходит RLS для записи заказов
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId  = session.metadata?.userId;

    // Получаем полную сессию с товарами
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const lineItems = fullSession.line_items?.data || [];

    // ── 1. СОЗДАЁМ ЗАКАЗ В SUPABASE ───────────────────────────────────────
    if (userId && userId !== "guest") {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id:           userId,
          status:            "paid",
          total:             (session.amount_total || 0) / 100,
          payment_method:    "stripe",
          stripe_payment_id: session.payment_intent as string,
          shipping_address:  (session as any).shipping_details ?? null,
        })
        .select()
        .single();

      if (!orderError && order) {
        // Добавляем товары в order_items
        const orderItems = lineItems.map(item => ({
          order_id:     order.id,
          product_name: item.description || "Product",
          price:        (item.price?.unit_amount || 0) / 100,
          quantity:     item.quantity || 1,
          size: (item.price as any)?.product_data?.metadata?.size || "—",        }));
        await supabase.from("order_items").insert(orderItems);
      }
    }

    // ── 2. УМЕНЬШАЕМ STOCK_COUNT ──────────────────────────────────────────
    for (const item of lineItems) {
      const productId = (item.price as any)?.product_data?.metadata?.productId;
      const qty       = item.quantity || 1;

      if (!productId) continue;

      // Берём текущий остаток
      const { data: product } = await supabase
        .from("products")
        .select("stock_count")
        .eq("id", productId)
        .single();

      if (!product) continue;

      const newCount = Math.max(0, (product.stock_count ?? 75) - qty);

      // Обновляем остаток
      await supabase
        .from("products")
        .update({
          stock_count: newCount,
          in_stock: newCount > 0,
        })
        .eq("id", productId);

      console.log(`Product ${productId}: ${product.stock_count} → ${newCount}`);
    }
  }

  return NextResponse.json({ received: true });
}