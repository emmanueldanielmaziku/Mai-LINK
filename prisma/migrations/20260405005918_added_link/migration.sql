/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `PaymentLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `PaymentLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaymentLink" ADD COLUMN     "link" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_link_key" ON "PaymentLink"("link");
