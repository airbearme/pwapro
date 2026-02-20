import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { amount, currency = "usd", paymentMethod, metadata = {} } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create payment intent with appropriate payment method types
    const paymentMethodTypes: string[] = ["card"]

    // Add Apple Pay and Google Pay if requested
    if (paymentMethod === "apple_pay" || paymentMethod === "google_pay") {
      paymentMethodTypes.push("apple_pay", "google_pay")
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        userId: user.id,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    )
  }
}
