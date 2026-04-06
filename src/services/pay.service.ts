import initiatePayment from "../apps/servers/create.payment";
import { prisma } from "../db/prisma";

export async function verifyCode(code: string) {
  const payment = await prisma.paymentLink.findUnique({
    where: {
      code: code,
    },
  });

  if (!payment) {
    return { success: false, error: "⚠️ Oops! Invalid payment link." };
  }

  if (payment.status == "PAID") {
    return {
      success: false,
      error:
        "💰 This payment has already been completed! If you have any concerns, please contact the business. 🙏",
    };
  }

  const paymentResponse = await initiatePayment(payment);

  return { success: true, data: paymentResponse };
}
