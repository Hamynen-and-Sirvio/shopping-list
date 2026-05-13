-- CreateTable
CREATE TABLE "entries" (
    "id" SERIAL NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);
