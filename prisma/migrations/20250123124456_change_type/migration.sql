/*
  Warnings:

  - You are about to alter the column `jeton` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "jeton" SET DATA TYPE INTEGER;
