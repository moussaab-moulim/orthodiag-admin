import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { toQueryParams } from '@utils/helpers';

const { STRIPE_SECRET_KEY } = process.env;
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});
export const checkoutSession = async (params: {
  priceId: string;
  customerId: string;
  origin: string;
  passId: number;
  hash: string;
}) => {
  const { priceId, customerId, origin, passId } = params;
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      pass: passId,
    },
    payment_intent_data: {
      metadata: {
        pass: passId,
      },
    },
    mode: 'payment',
    success_url: `${origin}${toQueryParams({ success: true })}`,
    cancel_url: `${origin}${toQueryParams({ canceled: true })}`,
    automatic_tax: { enabled: true },
    customer_update: { address: 'auto' },
  });

  return session;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Create Checkout Sessions from body params.

      const params = {
        priceId: req.body.priceId,
        customerId: req.body.customerId,
        origin: req.headers.origin!,
        passId: req.body.passId,
        hash: req.body.hash,
      };
      const session = await checkoutSession(params);
      res.redirect(
        303,
        session.url ??
          `${req.headers.origin}/${toQueryParams({
            canceled: true,
            hash: req.body.hash,
          })}`
      );
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
