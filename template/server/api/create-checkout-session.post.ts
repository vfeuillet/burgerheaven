import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2025-09-30.clover'
})

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: body.items.map((item: any) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${getRequestURL(event).origin}/?payment=success`,
      cancel_url: `${getRequestURL(event).origin}/?payment=cancelled`,
      customer_email: body.customerEmail,
    })

    return { url: session.url }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }
})