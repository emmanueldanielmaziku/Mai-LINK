import { encrypt } from "../lib/encryption";
import { prisma } from "../lib/prisma";
import { Auth } from "../validators/auth.validator";
import { Business } from "../validators/business.validator";

async function signUp(body: Business) {
  const hashedBusinessNumber = await Bun.password.hash(String(body.business_number));
  const existing = await prisma.business.findUnique({
    where: {
      businessNumberHash: hashedBusinessNumber,
    },
  });

  if (existing) {
    return { success: false, error: "Oops 🙊, Business already exist!" };
  }

  const hashedPasscode = await Bun.password.hash(String(body.business_code));
  const businessNumberHash = await Bun.password.hash(String(body.business_number));
  const encryptedBusinessNumber = await encrypt(String(body.business_number));
  const business = await prisma.business.create({
    data: {
      businessName: body.business_name,
      businessNumber: encryptedBusinessNumber,
      businessNumberHash: businessNumberHash,
      businessNetwork: body.business_network,
      businessCode: hashedPasscode,
    },
  });

  const { businessCode, ...data } = business;
  return { success: true, data };
}

//Login Service
async function signIn(body: Auth) {
  const hashedBusinessNumber = await Bun.password.hash(String(body.business_number))
  const result = await prisma.business.findUnique({
    where: {
      businessNumberHash: hashedBusinessNumber,
    },
  });

  if (!result) {
    return { success: false, error: "Oops 🙊, Lipa number doesn't exist!" };
  }

  return { success: true, data: result.businessName };
}
export default { signUp, signIn };
