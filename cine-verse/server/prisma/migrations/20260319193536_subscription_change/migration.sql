/*
  Warnings:

  - Changed the type of `planType` on the `subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "planType",
ADD COLUMN     "planType" "SubscriptionPlan" NOT NULL;
