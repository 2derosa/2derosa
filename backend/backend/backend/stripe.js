const stripe = require('stripe')('STRIPE_SECRET_KEY');

const createCheckoutSession = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{
      price: 'price_12345',
      quantity: 1,
    }],
    success_url: 'https://castlyai.carrd.co/success',
    cancel_url: 'https://castlyai.carrd.co/cancel',
  });

  res.json({ url: session.url });
};
