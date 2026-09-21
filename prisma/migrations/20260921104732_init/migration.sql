-- CreateEnum
CREATE TYPE "PhotoCategory" AS ENUM ('PORTRAIT', 'BOUDOIR');

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoCategoryLink" (
    "id" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,
    "category" "PhotoCategory" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PhotoCategoryLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhotoCategoryLink_category_order_idx" ON "PhotoCategoryLink"("category", "order");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoCategoryLink_photoId_category_key" ON "PhotoCategoryLink"("photoId", "category");

-- AddForeignKey
ALTER TABLE "PhotoCategoryLink" ADD CONSTRAINT "PhotoCategoryLink_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
