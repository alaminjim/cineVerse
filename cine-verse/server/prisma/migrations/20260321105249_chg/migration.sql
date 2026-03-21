-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0;
