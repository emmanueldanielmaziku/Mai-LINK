import { encrypt, decrypt } from "../lib/encryption";
import { hashForSearch } from "../lib/hash";
import { prisma } from "../lib/prisma";
import { Auth } from "../validators/auth.validator";
import { Business } from "../validators/business.validator";

async function signUp(body: Business) {
  const hashedBusinessNumber = hashForSearch(String(body.business_number));

  const existing = await prisma.business.findUnique({
    where: {
      businessNumberHash: hashedBusinessNumber,
    },
  });

  if (existing) {
    return { success: false, error: "Oops 🙊, Business already exist!" };
  }

  const hashedPasscode = await Bun.password.hash(String(body.business_code));

  const encryptedBusinessNumber = await encrypt(String(body.business_number));
  const business = await prisma.business.create({
    data: {
      businessName: body.business_name,
      businessNumber: encryptedBusinessNumber,
      businessNumberHash: hashedBusinessNumber,
      businessNetwork: body.business_network,
      businessCode: hashedPasscode,
    },
  });

  const decryptedBusinessNumber = await decrypt(business.businessNumber);
  const { businessCode, businessNumberHash, ...data } = business;
  return {
    success: true,
    data: { ...data, businessNumber: decryptedBusinessNumber },
  };
}

//Login Service
async function signIn(body: Auth) {
  const hashedBusinessNumber = hashForSearch(String(body.business_number));
  const result = await prisma.business.findUnique({
    where: {
      businessNumberHash: hashedBusinessNumber,
    },
  });

  if (!result) {
    return { success: false, error: "Oops 🙊, Lipa number doesn't exist!" };
  }

  const password = String(body.business_code);

  const verifyPassword = await Bun.password.verify(
    password,
    result.businessCode,
  );

  if (!verifyPassword) {
    return { success: false, error: "Oops 🙊, Wrong Credentials!" };
  }

  
  const decryptedBusinessNumber = await decrypt(result.businessNumber);
  const { businessCode, businessNumberHash, ...data } = result;
  return {
    success: true,
    data: { ...data, businessNumber: decryptedBusinessNumber },
  };

}

export default { signUp, signIn };