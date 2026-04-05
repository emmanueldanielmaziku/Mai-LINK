/*
  Warnings:

  - You are about to drop the column `link` on the `PaymentLink` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `PaymentLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `PaymentLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PaymentLink_link_key";

-- AlterTable
ALTER TABLE "PaymentLink" DROP COLUMN "link",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLink_code_key" ON "PaymentLink"("code");
