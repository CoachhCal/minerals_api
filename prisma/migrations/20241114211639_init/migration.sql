-- CreateTable
CREATE TABLE "product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "image_filename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "customer" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" REAL NOT NULL,
    "last_name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
