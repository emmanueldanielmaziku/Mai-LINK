import { prisma } from "../lib/prisma";
import { Business } from "../validators/business.validator";

async function addBusiness(body: Business) {
  const existing = await prisma.business.findUnique({
    where: {
      businessNumber: body.business_number,
    },
  });

  if (existing) {
    return { success: false, error: "Oops 🙊, Business already exist!" };
  }

  const business = await prisma.business.create({
    data: {
      businessName: body.business_name,
      businessNumber: body.business_number,
      businessNetwork: body.business_network,
      businessCode: body.business_code,
    },
  });

  return { success: true, data: business };
}

export default addBusiness;
