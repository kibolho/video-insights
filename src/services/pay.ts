import { api } from "@/lib/axios";
import getStripe from "@/lib/getStripe";

const defaultProductId = process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID as string;

export const handleCreateCheckoutSession = async (
  productId: string = defaultProductId
) => {
  try {
    const res = await api().post(`/api/stripe/checkout-session`, {
      productId,
    });
    const checkoutSession = res.data.session;

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    if (error) throw error;
  } catch (error: any) {
    console.warn(error?.message ?? error?.response?.data?.error?.message);
  }
};
