import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { GroupConversation, Prisma } from "@prisma/client";

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {
    //
  }

  async getConversationForUserId(userId: string) {
    return this.prisma.$queryRaw`SELECT
	REPLACE(REPLACE(og.conversation_key,${userId}, ''), '_', '') AS user_id,
	og.group_id,
	og.last_at,
	cm.content AS last_message,
	cm.sender_id AS last_sender
FROM (
	SELECT
		conversation_key,
		group_id,
		MAX(created_at) AS last_at
	FROM
		messages
	WHERE
		sender_id::text =${userId}
		OR receiver_id::text =${userId}
	  OR group_id in(
			SELECT
				group_id FROM group_conversation_to_participant_map
			WHERE
				participant_id::text =${userId})
	GROUP BY
		conversation_key, group_id) og
	LEFT JOIN messages cm ON og.last_at = cm.created_at
		AND(og.conversation_key = cm.conversation_key
			OR og.group_id = cm.group_id) ORDER BY last_at DESC;`;
  }

  async getGroupDetailsByIds(ids: string[]) {
    const data = await this.prisma.groupConversation.findMany({
      where: { id: { in: ids } },
    });
    return data.reduce((acc, group) => {
      acc[group.id] = group;
      return acc;
    }, {} as Record<string, GroupConversation>);
  }

  async getGroupParticipantsById(id: string) {
    return await this.prisma.groupConversationToParticipantMap
      .findMany({
        where: {
          groupId: id,
        },
        select: { participantId: true },
      })
      .then((res) => res.map((r) => r.participantId));
  }

  async createMessage(data: Prisma.MessageCreateInput) {
    await this.prisma.message.create({ data });
  }

  async findManyMessages(options: Prisma.MessageFindManyArgs) {
    return this.prisma.message.findMany(options);
  }

  async countMessages(options: Prisma.MessageCountArgs) {
    return this.prisma.message.count(options);
  }

  async createGroupWithMessage({
    groupName,
    messageContent,
    participantIds,
    senderId,
  }: {
    senderId: string;
    groupName: string;
    messageContent: string;
    participantIds: string[];
  }) {
    return await this.prisma.$transaction(async (tx) => {
      const group = await tx.groupConversation.create({
        data: { name: groupName, createdBy: senderId },
      });

      await tx.groupConversationToParticipantMap.createMany({
        data: [...participantIds, senderId].map((id) => ({
          participantId: id,
          groupId: group.id,
        })),
      });

      await tx.message.create({
        data: {
          senderId,
          groupId: group.id,
          content: messageContent,
        },
      });

      return group.id;
    });
  }
}
