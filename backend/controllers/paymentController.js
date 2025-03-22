import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/orders.js";
import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session   =>  /api/payment/checkout_session
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    const body = req?.body;

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "thb",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: [process.env.STRIPE_TAX_RATE],
        quantity: item?.quantity,
      };
    });

    const shippingInfo = body?.shippingInfo;

    const shipping_rate =
      body?.itemsPrice >= 200
        ? process.env.STRIPE_SHIPPING_RATE_FREE
        : process.env.STRIPE_SHIPPING_RATE_PAID;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
      shipping_options: [
        {
          shipping_rate,
        },
      ],
      line_items,
    });

    console.log(session);
    res.status(200).json({
      url: session.url,
    });
  }
);

const getOrderItems = async (line_items) => {
  const cartItems = await Promise.all(
    line_items?.data?.map(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      return {
        product: product.metadata.productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0],
        size: product.metadata.size || "small",
      };
    })
  );
  return cartItems;
};

// Create new order after payment   =>  /api/v1/payment/webhook
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const orderItems = await getOrderItems(line_items);

      const user = session.client_reference_id;
      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = session.metadata.itemsPrice;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };

      await Order.create(orderData);
      return res.status(200).json({ success: true });
    }

    // ถ้า event ไม่ใช่ "checkout.session.completed"
    return res
      .status(400)
      .json({ success: false, message: "Invalid event type" });
  } catch (error) {
    console.error("Stripe Webhook Error:", error);
    next(error); // ✅ ให้ middleware จัดการ error
  }
});
