const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, amount } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const body = {
    source: token.id,
    amount: amount,
    currency: "usd"
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).json({ error: stripeErr });
    } else {
      res.status(200).json({ success: stripeRes });
    }
  });
}
