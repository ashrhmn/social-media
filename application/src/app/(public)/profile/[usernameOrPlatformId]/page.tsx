import ProfileView from "@/app/(authenticated)/profile/ProfileView";
import { getAuthUser } from "@/lib/auth";
import { AuthUserService } from "@/services/AuthUserService";
import { UserService } from "@/services/UserService";
import { notFound, redirect } from "next/navigation";
import Container from "typedi";

const authUserService = Container.get(AuthUserService);
const userService = Container.get(UserService);

const PublicProfilePage = async ({ params: { usernameOrPlatformId } }: any) => {
  const { user: authUser } = await getAuthUser();
  const user = await authUserService
    .getOneAuthUser({
      where: { username: usernameOrPlatformId },
    })
    .catch(() => null);
  if (user) {
    if (authUser?.user?.username === user?.username) throw redirect("/profile");
    const platformUser = await userService.getUserByEmail(user.email);
    return <ProfileView user={user} platformUser={platformUser} publicView />;
  }
  const platformUser = await userService
    .getUsersByIds([usernameOrPlatformId])
    .then((res) => res[usernameOrPlatformId]);
  if (!platformUser) throw notFound();
  const visitingAuthUser = await authUserService.getOneAuthUser({
    where: { email: platformUser.email },
  });
  if (!visitingAuthUser) throw notFound();
  if (authUser?.user?.username === visitingAuthUser?.username)
    throw redirect("/profile");
  return (
    <ProfileView
      user={visitingAuthUser}
      platformUser={platformUser}
      publicView
    />
  );
};

export default PublicProfilePage;
