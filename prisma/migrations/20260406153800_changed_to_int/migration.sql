/*
  Warnings:

  - Changed the type of `businessNumber` on the `LipaNumber` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LipaNumber" DROP COLUMN "businessNumber",
ADD COLUMN     "businessNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LipaNumber_businessNumber_key" ON "LipaNumber"("businessNumber");
