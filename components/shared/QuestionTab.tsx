import { getUserQuestions } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "./cards/QuestionCard";
import { SearchParamsProps } from "@/types";

interface QuestionTabProps extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({
  searchParams,
  userId,
  clerkId,
}: QuestionTabProps) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  // console.log(result);

  return (
    <div>
      {result.userQuestions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </div>
  );
};

export default QuestionTab;
