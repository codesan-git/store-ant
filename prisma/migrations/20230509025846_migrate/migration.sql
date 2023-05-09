-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'PAID';
ALTER TYPE "Status" ADD VALUE 'RETURNING';
ALTER TYPE "Status" ADD VALUE 'CANCELING';
ALTER TYPE "Status" ADD VALUE 'CANCEL_REJECTED';

-- AlterTable
ALTER TABLE "ProductInCart" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "image" TEXT;
