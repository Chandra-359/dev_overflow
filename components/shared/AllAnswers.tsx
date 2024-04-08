import React from "react";
import Filter from "../Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswersByQuestionId } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface AnswerProps {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: string;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter
}: AnswerProps) => {


  const result = await getAnswersByQuestionId({ 
    questionId,
    page: page ? +page : 1,
    sortBy: filter
  });

  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filter={AnswerFilters} />
      </div>
      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.avatar}
                    alt="user avatar"
                    width={18}
                    height={18}
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {" "}
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                      <span className="max-sm:hidden"> - </span>
                      answered {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-end">
                  <Votes
                  type="Answer"
                  itemId = {JSON.stringify(answer._id)}
                  userId = {JSON.stringify(userId)}
                  upvotes = {answer.upvotes.length}
                  hasupVoted = {answer.upvotes.includes(userId)}
                  downvotes = {answer.downvotes.length}
                  hasdownVoted = {answer.downvotes.includes(userId)}
                /></div>
              </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>

      <div className="mt-10 w-full">
        <Pagination
          pageNumber={page ? +page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
