import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopInteractedTag } from "@/lib/actions/tag.action";
import { Badge } from "@/components/ui/badge";
import InfoTags from "../InfoTags";

interface UserTypes {
  user: {
    _id: string;
    clerkId: string;
    avatar: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: UserTypes) => {
  const interactedTags = await getTopInteractedTag({ userId: user._id });

  return (
    <div className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.avatar}
          alt="user avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
        <Link
          href={`/profile/${user.clerkId}`}
          className="shadow-light100_darknone w-full max-xs:min-w-full 
        xs:w-[260px]"
        >
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{user.username}
            </p>
          </div>
        </Link>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <InfoTags key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </div>
  );
};

export default UserCard;
