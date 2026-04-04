/*
  Warnings:

  - The primary key for the `LipaNumber` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LipaNumber" DROP CONSTRAINT "LipaNumber_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "LipaNumber_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "LipaNumber_id_seq";
