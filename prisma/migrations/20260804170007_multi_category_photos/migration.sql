/*
  Warnings:

  - You are about to drop the column `category` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `name` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PhotoCategoryLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "photoId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PhotoCategoryLink_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Photo" ("alt", "createdAt", "filename", "id") SELECT "alt", "createdAt", "filename", "id" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PhotoCategoryLink_category_order_idx" ON "PhotoCategoryLink"("category", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoCategoryLink_photoId_category_key" ON "PhotoCategoryLink"("photoId", "category");
