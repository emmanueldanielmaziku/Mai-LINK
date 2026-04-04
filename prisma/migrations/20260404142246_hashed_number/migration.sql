/*
  Warnings:

  - A unique constraint covering the columns `[businessNumberHash]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessNumberHash` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Business_businessNumber_key";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "businessNumberHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Business_businessNumberHash_key" ON "Business"("businessNumberHash");
