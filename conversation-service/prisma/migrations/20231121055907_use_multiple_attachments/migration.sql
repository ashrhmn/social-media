/*
 Warnings:
 
 - You are about to drop the column `attachmentPath` on the `messages` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "attachmentPath",
  ADD COLUMN "attachment_paths" TEXT [] DEFAULT ARRAY []::TEXT [];