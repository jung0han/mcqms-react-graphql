-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linkId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("id", "linkId", "userId") SELECT "id", "linkId", "userId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "linkId_userId_unique" ON "Vote"("linkId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
