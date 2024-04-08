import Profile from "@/components/forms/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata:Metadata={
  title: "Edit Profile | DevOverFlow ;)",
  description: "Edit your profile on the community forum.",
}

const Page = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ clerkUserId: userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default Page;
