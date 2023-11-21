-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "content" TEXT,
    "attachmentPath" TEXT,
    "sender_id" UUID NOT NULL,
    "receiver_id" UUID,
    "group_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_conversations" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_conversation_to_participant_map" (
    "id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "participant_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_conversation_to_participant_map_pkey" PRIMARY KEY ("id")
);
