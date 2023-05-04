/*
  Warnings:

  - Added the required column `count` to the `ProductInCart` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INCART', 'UNPAID', 'PACKING', 'DELIVERING', 'FINISHED', 'RETURNED', 'CANCELED');

-- AlterTable
ALTER TABLE "ProductInCart" ADD COLUMN     "count" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'INCART';
