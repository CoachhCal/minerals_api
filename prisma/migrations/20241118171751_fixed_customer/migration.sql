-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customer" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);
INSERT INTO "new_customer" ("customer_id", "email", "first_name", "last_name", "password") SELECT "customer_id", "email", "first_name", "last_name", "password" FROM "customer";
DROP TABLE "customer";
ALTER TABLE "new_customer" RENAME TO "customer";
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
