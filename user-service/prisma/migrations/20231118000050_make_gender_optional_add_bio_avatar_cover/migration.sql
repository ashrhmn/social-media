-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_path" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "cover_photo_path" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "gender" DROP DEFAULT;
