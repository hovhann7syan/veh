import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { items, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    const lineItems = items.map((item: {
      id: number;
      name: string;
      price: number;
      size: string;
      quantity: number;
    }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Size: ${item.size}`,
          // ← productId и size передаём в метаданных — webhook их читает
          metadata: {
            productId: String(item.id),
            size:      item.size,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items:           lineItems,
      mode:                 "payment",
      success_url:          `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:           `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata: {
        userId: userId || "guest",
      },
      shipping_address_collection: {
        allowed_countries: ["AM", "US", "GB", "DE", "FR", "RU", "UA"],
      },
      custom_text: {
        submit: { message: "Handcrafted in Yerevan, Armenia 🇦🇲" },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}