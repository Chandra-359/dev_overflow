import React from "react";
import Image from "next/image";
import Link from "next/link";
import InfoTags from "@/components/shared/InfoTags";

const RightSideBar = () => {
  const questions = [
    { _id: 1, title: "How to improve web performance?" },
    { _id: 2, title: "What's new in React 18?" },
    { _id: 3, title: "How to center a div in CSS?" },
    { _id: 4, title: "What are hooks in React?" },
    { _id: 5, title: "How to fetch data in React?" },
  ];

  const tags = [
    { _id: 1, name: "JavaScript", totalQuestions: 5 },
    { _id: 2, name: "React", totalQuestions: 10 },
    { _id: 3, name: "TypeScript", totalQuestions: 3 },
    { _id: 4, name: "Node", totalQuestions: 7 },
    { _id: 5, name: "CSS", totalQuestions: 4 },
  ];

  return (
    <>
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {questions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
              key={question._id}
              className="flex cursor-pointer items-center justify-between gap-4"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col">
          {tags.map((tag) => (
            <InfoTags
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default RightSideBar;
