import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import React from "react";

interface EditProps {
  params: {
    itemId: string;
  };
}

const Page = async ({ params }: EditProps) => {
  // console.log(params);

  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ clerkUserId: userId });
  const result = await getQuestionById({ questionId: params.itemId });
  // console.log(JSON.stringify(result));
  

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="Edit"
          mongoUserId={JSON.stringify(mongoUser?._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
