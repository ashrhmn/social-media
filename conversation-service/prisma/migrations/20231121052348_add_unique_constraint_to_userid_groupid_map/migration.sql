/*
 Warnings:
 
 - A unique constraint covering the columns `[group_id,participant_id]` on the table `group_conversation_to_participant_map` will be added. If there are existing duplicate values, this will fail.
 
 */
-- CreateIndex
CREATE UNIQUE INDEX "group_conversation_to_participant_map_group_id_participant__key" ON "group_conversation_to_participant_map"("group_id", "participant_id");