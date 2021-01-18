-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewPart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "partNo" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'New',
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'Waiting',
    "requesterId" INTEGER NOT NULL,
    "plannerId" INTEGER NOT NULL,
    "testerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("plannerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("testerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NewPart" ("id", "model", "partNo", "vendorId", "category", "type", "sequence", "status", "requesterId", "plannerId", "testerId", "createdAt") SELECT "id", "model", "partNo", "vendorId", "category", "type", "sequence", "status", "requesterId", "plannerId", "testerId", "createdAt" FROM "NewPart";
DROP TABLE "NewPart";
ALTER TABLE "new_NewPart" RENAME TO "NewPart";
CREATE UNIQUE INDEX "NewPart.partNo_unique" ON "NewPart"("partNo");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
