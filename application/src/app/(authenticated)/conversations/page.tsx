import { getAuthUser } from "@/lib/auth";
import { ConversationService } from "@/services/ConversationService";
import { UserService } from "@/services/UserService";
import { redirect } from "next/navigation";
import Container from "typedi";
import ConversationListItem from "./ConversationListItem";
import { PlusIcon } from "@/app/components/Svgs";
import Link from "next/link";
import SocketListener from "./SocketListener";

const conversationService = Container.get(ConversationService);
const userService = Container.get(UserService);

export default async function ConversationListPage() {
  const { user } = await getAuthUser();
  const platformUser = await userService
    .getUserByEmail(user.user.email)
    .catch(() => redirect("/complete-sign-up"));
  const conversations = await conversationService.getConversationList(
    platformUser.id
  );
  const userMap = await userService.getUsersByIds(
    Array.from(
      new Set([
        ...conversations.map((c: any) => c.user_id).filter(Boolean),
        ...conversations.map((c: any) => c.last_sender).filter(Boolean),
      ])
    )
  );
  const groupDetailsMap = await conversationService.getGroupDetailsByIds(
    conversations.map((c: any) => c.group_id).filter(Boolean)
  );

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-10">Conversation</h1>
      <div className="flex gap-1 items-center">
        <Link
          className="flex items-center btn btn-outline w-1/2"
          href={"/conversations/new-message"}
        >
          <PlusIcon className="w-6 h-6" />
          <span>New Message</span>
        </Link>
        <Link
          className="flex items-center btn btn-outline w-1/2"
          href={"/conversations/new-group"}
        >
          <PlusIcon className="w-6 h-6" />
          <span>New Group</span>
        </Link>
      </div>
      <ul>
        {conversations.map((c: any) => (
          <ConversationListItem
            key={c.user_id || c.group_id}
            conversation={c}
            userMap={userMap}
            groupDetailsMap={groupDetailsMap}
            userId={platformUser.id}
          />
        ))}
      </ul>
      <SocketListener />
    </div>
  );
}
