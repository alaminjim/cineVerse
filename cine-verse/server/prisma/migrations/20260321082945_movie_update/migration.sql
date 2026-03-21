-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('MOVIE', 'SERIES');

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "episodes" INTEGER,
ADD COLUMN     "runtime" INTEGER,
ADD COLUMN     "seasons" INTEGER,
ADD COLUMN     "streamingLink" TEXT,
ADD COLUMN     "type" "ContentType" NOT NULL DEFAULT 'MOVIE';

-- CreateIndex
CREATE INDEX "movies_type_idx" ON "movies"("type");
