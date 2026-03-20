/*
  Warnings:

  - A unique constraint covering the columns `[userId,movieId,purchaseType]` on the table `purchase` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `purchaseType` on the `purchase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "purchase" ADD COLUMN     "status" "PurchaseStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "purchaseType",
ADD COLUMN     "purchaseType" "PurchaseType" NOT NULL;

-- CreateIndex
CREATE INDEX "purchase_purchaseType_idx" ON "purchase"("purchaseType");

-- CreateIndex
CREATE INDEX "purchase_status_idx" ON "purchase"("status");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_userId_movieId_purchaseType_key" ON "purchase"("userId", "movieId", "purchaseType");
