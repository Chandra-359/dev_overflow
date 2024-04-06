import React from "react";
import { getQuestionById } from "@/lib/actions/question.action";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/shared/Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import InfoTags from "@/components/shared/InfoTags";
import Answer from "@/components/forms/Answer";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";
import { SearchParamsProps } from "@/types";

interface ParamProp extends SearchParamsProps{
  params:{
    _id:string
  }
}

const Page = async ({ params, searchParams }: ParamProp) => {
  // use searchParams to get the filtering queries
  //  console.log(params);

  const result = await getQuestionById({ questionId: params._id });
  const { userId } = auth();
  // console.log(userId);

  if (!userId) {
    redirect("/sign-in");
  }
  const mongoUser = await getUserById({ clerkUserId: userId });
  // console.log(mongoUser);

  // console.log(result);
  // {
  //   question: {
  //     _id: new ObjectId('660aea8ba7f6a1fd508895f5'),
  //     title: 'How to use amplify 2 to develop a real time drawing game ?',
  //     content: '<p>Help me with the intial setup and provide any availabe docs</p>\n',
  //     tags: [ [Object], [Object], [Object] ],
  //     views: 0,
  //     upvotes: [],
  //     downvotes: [],
  //     author: {
  //       _id: new ObjectId('660aea2cd59f6eba11fa23e1'),
  //       clerkId: 'user_2eVYiWlsb8F3KSgAbDvl1w8wNqt',
  //       name: 'chandra  vamsi reddy ',
  //       avatar: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJlVllrSGVOQUM0NGhQTEVJY1pHVHB2cFROOSJ9'
  //     },
  //     answers: [],
  //     createdAt: 2024-04-01T17:10:35.925Z,
  //     __v: 0
  //   }
  // }

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`profile/${result.question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.question.author.avatar}
              alt="profile"
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">

            <Votes
            type='Question'
            itemId = {JSON.stringify(result.question._id)}
            userId = {JSON.stringify(mongoUser._id)}
            upvotes = {result.question.upvotes.length}
            hasupVoted = {result.question.upvotes.includes(mongoUser._id)}
            downvotes = {result.question.downvotes.length}
            hasdownVoted = {result.question.downvotes.includes(mongoUser._id)}
            hasSaved = {mongoUser?.saved.includes(result.question._id)}
            />

            </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex w-full flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={`asked ${getTimestamp(result.question.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result.question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.question.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.question.tags.map((tag: any) => (
          <InfoTags
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
      questionId = {result.question._id}
      userId = {mongoUser._id}
      totalAnswers = {result.question.answers.length}
      page = {searchParams?.page}
      filter = {searchParams?.filter}
      />

      <Answer
        authorId={JSON.stringify(mongoUser._id)}
        questionId={JSON.stringify(result.question._id)}
        question={result.question.content}
      />
    </>
  );
};

export default Page;
