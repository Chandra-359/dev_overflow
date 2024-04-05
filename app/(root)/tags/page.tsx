import React from "react";
import LocalSearch from "@/components/shared/search/LocalSearch";
import Filter from "@/components/Filter";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import NoResult from "@/components/shared/NoResult";
import TagCard from "@/components/shared/cards/TagCard";
import Link from "next/link";
import { SearchParamsProps } from "@/types";

const Page = async ({searchParams}: SearchParamsProps) => {
  const result = await getAllTags({
    searchQuery: searchParams.q,
  });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/tags"
          iconPosition="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />

        <Filter
          filter={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <TagCard key={tag._id} tag={tag} />
            </Link>
          ))
        ) : (
          <NoResult
            title="No tags yet"
            description="Ask questions to create tags!"
            link="/ask-question"
            linkTitle="Ask Question"
          />
        )}
      </section>
    </div>
  );
};

export default Page;
