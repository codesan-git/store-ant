/*
  Warnings:

  - You are about to drop the column `Address` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `Shop` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profile_id]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_id` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_address_id_fkey";

-- DropIndex
DROP INDEX "Profile_address_id_key";

-- DropIndex
DROP INDEX "Shop_address_id_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "Address",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "isMainAddress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isShopAddress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "address_id";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "address_id";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Address_profile_id_key" ON "Address"("profile_id");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
