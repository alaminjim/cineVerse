/*
  Warnings:

  - You are about to drop the column `commentCount` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `reviews` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropIndex
DROP INDEX "reviews_isApproved_idx";

-- DropIndex
DROP INDEX "reviews_userId_movieId_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "commentCount",
DROP COLUMN "isApproved",
DROP COLUMN "likesCount",
ALTER COLUMN "rating" SET DATA TYPE INTEGER,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "reviews_status_idx" ON "reviews"("status");
