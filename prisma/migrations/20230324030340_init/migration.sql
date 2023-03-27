/*
  Warnings:

  - A unique constraint covering the columns `[address_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address_id]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "address_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "address_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "Address" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_address_id_key" ON "Profile"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_address_id_key" ON "Shop"("address_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
