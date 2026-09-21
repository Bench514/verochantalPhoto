-- AlterTable
ALTER TABLE "PhotoSession" ADD COLUMN     "includedCount" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SessionPhoto" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;
