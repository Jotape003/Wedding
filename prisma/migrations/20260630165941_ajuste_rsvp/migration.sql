/*
  Warnings:

  - You are about to drop the column `vaiComparecer` on the `Convidado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Convidado" DROP COLUMN "vaiComparecer";

-- AlterTable
ALTER TABLE "Familia" ADD COLUMN     "numeroConfirmados" INTEGER;
