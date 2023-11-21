import { Suspense } from "react";
import PostList from "./PostList";
import Link from "next/link";
import Button from "@/app/components/Button";
import ProfileImage from "./ProfileImage";

const ProfileView = ({ user, platformUser, publicView = false }: any) => {
  const username = user?.user?.username || user?.username;
  const authUserId = user?.sub || user?.id;
  return (
    <div className="p-3">
      <div className="flex justify-between">
        <div>
          <Link href={`/profile/${username}`}>
            <h1 className="text-3xl font-bold">
              {platformUser.firstName + " " + platformUser.lastName}
            </h1>
          </Link>
          <h2 className="text-xl font-bold">@{username}</h2>
          {platformUser.bio && <p className="mt-4">{platformUser.bio}</p>}
          {platformUser.website && (
            <a href={platformUser.website} className="mt-2 mb-4 block">
              {platformUser.website}
            </a>
          )}
          {!publicView && (
            <>
              <Link href="/edit-profile">
                <Button>Edit Profile</Button>
              </Link>
              <Link href="/create-post">
                <Button className="ml-3">Create Post</Button>
              </Link>
            </>
          )}
        </div>
        <Suspense fallback={<h1>Loading...</h1>}>
          <ProfileImage
            username={username}
            avatarPath={platformUser.avatarPath}
          />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <h1 className="font-bold text-2xl text-center">Loading posts...</h1>
        }
      >
        <PostList
          platformUserId={platformUser.id}
          firstName={platformUser.firstName}
          lastName={platformUser.lastName}
          username={username}
          userId={authUserId}
          publicView={publicView}
        />
      </Suspense>
    </div>
  );
};

export default ProfileView;
