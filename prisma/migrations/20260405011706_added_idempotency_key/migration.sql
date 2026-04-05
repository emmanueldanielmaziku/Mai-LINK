/*
  Warnings:

  - A unique constraint covering the columns `[idempotencyKey]` on the table `PaymentLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotencyKey` to the `PaymentLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "idempotencyKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_idempotencyKey_key" ON "PaymentLink"("idempotencyKey");
