-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SessionStatus" ADD VALUE 'GALLERY_SENT';
ALTER TYPE "SessionStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "PhotoSession" ADD COLUMN     "coverPhotoId" TEXT;

-- AddForeignKey
ALTER TABLE "PhotoSession" ADD CONSTRAINT "PhotoSession_coverPhotoId_fkey" FOREIGN KEY ("coverPhotoId") REFERENCES "SessionPhoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
