import { prisma } from "../db/prisma";

export async function generateLinkCode(
  amount: number,
  businessId: string,
  code: string,
  idempotencyKey: string,
) {
  const existingKey = await prisma.paymentLink.findUnique({
    where: { idempotencyKey },
  });

  if (existingKey) {
    return { success: false, error: "⚠️ Duplicated request!" };
  }
  const existingLink = await prisma.paymentLink.findUnique({
    where: { code },
  });

  if (existingLink) {
    return { success: false, error: "⚠️ Duplicated link!" };
  }
  const paylink = await prisma.paymentLink.create({
    data: {
      amount: amount,
      code: code,
      idempotencyKey: idempotencyKey,
      business: {
        connect: { id: businessId },
      },
    },
  });

  if (!paylink) {
    return { success: false, error: "⚠️ Failed to generate payment link" };
  }

  return { success: true, data: paylink };
}
