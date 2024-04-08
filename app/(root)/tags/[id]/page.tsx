import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import QuestionCard from '@/components/shared/cards/QuestionCard'
import LocalSearch from '@/components/shared/search/LocalSearch'
import { getQuestionsByTagId } from '@/lib/actions/tag.action'
import { URLProps } from '@/types'
import React from 'react'
import type { Metadata } from "next";

export const metadata:Metadata={
  title: "Tag | DevOverFlow ;)",
  description: "Questions related to a specific tag.",
}

const Page = async ({params, searchParams}: URLProps) => {

    const result = await getQuestionsByTagId({
        tagId: params.id,
        page: searchParams.page ? +searchParams.page : 1,
        searchQuery: searchParams.q
    })

    // console.log(`tag page questions: ${result.questions[0].upvotes}`); 
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div
        className="mt-11 w-full"
      >
        <LocalSearch
          route={`/tags/${params.id}`}
          iconPosition="left"
          iconSrc="/assets/icons/search.svg"
          placeholder="Search tag questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((question : any) => (

            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              answers={question.answers}
              upvotes={question.upvotes}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no tag questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </div>
      
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />  
      </div>
      


    </>
  )
}

export default Page