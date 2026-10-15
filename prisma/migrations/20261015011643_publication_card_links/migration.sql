-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "showDownload" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showRead" BOOLEAN NOT NULL DEFAULT true;
