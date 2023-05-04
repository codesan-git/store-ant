/*
  Warnings:

  - Added the required column `count` to the `ProductInCart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInCart" ADD COLUMN     "count" INTEGER NOT NULL;
