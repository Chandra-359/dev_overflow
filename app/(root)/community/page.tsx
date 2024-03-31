import React from "react";
import { getAllUsers } from "@/lib/actions/user.action";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/Filter";
import { UserFilters } from "@/constants/filters";
import UserCard from "@/components/shared/cards/UserCard";
import NoResult from "@/components/shared/NoResult";

const Page = async () => {
  const result = await getAllUsers({});

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          iconPosition="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />

        <Filter
          filter={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.allUsers.length > 0 ? (
          result.allUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
            />
          ))
        ) : (
            <NoResult
            title="No users yet"
            description="Sign up now to join the community!"
            link="/sign-up"
            linkTitle="Join to be first!"
          />
        )}
      </section>
    </>
  );
};

export default Page;
