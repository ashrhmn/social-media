-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "content" TEXT,
    "media_path" TEXT,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);
