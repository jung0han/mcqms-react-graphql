/*
  Warnings:

  - You are about to drop the column `venderId` on the `NewPart` table. All the data in the column will be lost.
  - You are about to drop the `Vender` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Vender.code_unique";

-- CreateTable
CREATE TABLE "Vendor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "addedById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewPart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "partNo" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "requesterId" INTEGER NOT NULL,
    "plannerId" INTEGER NOT NULL,
    "testerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("testerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NewPart" ("id", "model", "partNo", "category", "type", "sequence", "status", "requesterId", "plannerId", "testerId", "createdAt") SELECT "id", "model", "partNo", "category", "type", "sequence", "status", "requesterId", "plannerId", "testerId", "createdAt" FROM "NewPart";
DROP TABLE "NewPart";
ALTER TABLE "new_NewPart" RENAME TO "NewPart";
CREATE UNIQUE INDEX "NewPart.partNo_unique" ON "NewPart"("partNo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vender";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "Vendor.code_unique" ON "Vendor"("code");
