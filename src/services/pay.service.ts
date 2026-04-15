import initiatePayment from "../apps/servers/create.payment";
import { prisma } from "../db/prisma";

async function getValidPaymentByCode(code: string) {
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

  return { success: true, data: payment };
}

export async function verifyCode(code: string) {
  const paymentStatus = await getValidPaymentByCode(code);

  if (!paymentStatus.success) {
    return paymentStatus;
  }

  return { success: true, data: paymentStatus.data };
}

export async function payByCode(code: string, phoneNumber: string) {
  const paymentStatus = await getValidPaymentByCode(code);

  if (!paymentStatus.success) {
    return paymentStatus;
  }

  const normalizedPhone = phoneNumber.replace(/\D/g, "");
  if (normalizedPhone.length < 10 || normalizedPhone.length > 15) {
    return { success: false, error: "⚠️ Please enter a valid phone number." };
  }

  const paymentResponse = await initiatePayment(paymentStatus.data, normalizedPhone);

  return { success: true, data: paymentResponse };
}
