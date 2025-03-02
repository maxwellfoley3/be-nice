/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sentimentLabel` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentimentScore` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "sentimentLabel" TEXT NOT NULL,
ADD COLUMN     "sentimentScore" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");
