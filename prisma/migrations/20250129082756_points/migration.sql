/*
  Warnings:

  - Added the required column `points` to the `Ranking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ranking" ADD COLUMN     "points" INTEGER NOT NULL;
