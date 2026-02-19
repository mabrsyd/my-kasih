/*
  Warnings:

  - A unique constraint covering the columns `[coverId]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.
  - Made the column `coverId` on table `Memory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_coverId_fkey";

-- AlterTable
ALTER TABLE "Memory" ALTER COLUMN "coverId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Memory_coverId_key" ON "Memory"("coverId");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
