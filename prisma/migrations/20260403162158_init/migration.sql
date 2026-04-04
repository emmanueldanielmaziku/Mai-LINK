-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessNumber" INTEGER NOT NULL,
    "businessNetwork" TEXT NOT NULL,
    "businessCode" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentLink" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LipaNumber" (
    "id" SERIAL NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessNumber" INTEGER NOT NULL,
    "network" TEXT NOT NULL,

    CONSTRAINT "LipaNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessName_key" ON "Business"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessNumber_key" ON "Business"("businessNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LipaNumber_businessName_key" ON "LipaNumber"("businessName");

-- CreateIndex
CREATE UNIQUE INDEX "LipaNumber_businessNumber_key" ON "LipaNumber"("businessNumber");

-- AddForeignKey
ALTER TABLE "PaymentLink" ADD CONSTRAINT "PaymentLink_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
