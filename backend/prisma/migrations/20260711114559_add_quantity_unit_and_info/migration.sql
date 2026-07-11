-- AlterTable
ALTER TABLE "Entry" RENAME CONSTRAINT "entries_pkey" TO "Entry_pkey";

ALTER TABLE "Entry"
ADD COLUMN     "additionalInfo" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'kpl';
