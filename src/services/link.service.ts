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

export async function listBusinessLinks(businessId: string) {
  try {
    const links = await prisma.paymentLink.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: links } as const;
  } catch {
    return { success: false, error: "⚠️ Failed to load payment links." } as const;
  }
}

export async function deleteBusinessLink(linkId: string, businessId: string) {
  const deleted = await prisma.paymentLink.deleteMany({
    where: {
      id: linkId,
      businessId,
    },
  });

  if (deleted.count === 0) {
    return { success: false, error: "⚠️ Payment link not found." };
  }

  return { success: true };
}
