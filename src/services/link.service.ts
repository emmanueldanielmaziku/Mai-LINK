import { prisma } from "../lib/prisma";

export async function generateLink(
  amount: number,
  businessId: string,
  link: string,
  idempotencyKey: string,
) {
  const existingKey = await prisma.paymentLink.findUnique({
    where: { idempotencyKey },
  });

  if (existingKey) {
    return { success: false, error: "⚠️ Duplicated request!" };
  }
  const existingLink = await prisma.paymentLink.findUnique({
    where: { link },
  });

  if (existingLink) {
    return { success: false, error: "⚠️ Duplicated link!" };
  }
  const paylink = await prisma.paymentLink.create({
    data: {
      amount: amount,
      link: link,
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
