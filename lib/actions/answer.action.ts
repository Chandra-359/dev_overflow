"use server"

import { Answer } from "@/database/answer.model";
import { connectToDatabase } from "../mongoose"
import { AnswerVoteParams, CreateAnswerParams,GetAnswersParams } from "./shared.types";
import { User } from "@/database/user.model";
import { Question } from "@/database/question.model";
import { revalidatePath } from "next/cache";


export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase();
        const { content, author, question, path } = params;

        // Create a new answer
        const newAnswer = await Answer.create({ content, author, question });

        // TODO: Append the answerID to the question's answers array

        await Question.findByIdAndUpdate(question, { $push: { answers: newAnswer._id } });

        // TODO: increment reputation of user by 10
        await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

        // revalidate is used to revalidate the cache, so that newly submitted answer is visible
        revalidatePath(path)

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAnswersByQuestionId(params: GetAnswersParams) {
    try{
        connectToDatabase();
        
        const {questionId} = params;
        

        const answers = await Answer.find({ question: questionId }).populate("author", "_id clerkId name avatar").sort({ createdAt: -1 })
        // console.log(answers);
        
        
        return {answers};
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase();

        const { answerId, userId, hasupVoted, hasdownVoted, path } = params

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } }
        } else if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId }, $push: { upvotes: userId } }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if (!answer) {
            throw new Error('Answer not found')
        }
        // console.log(`log from answer.action.ts from upvoteAnswer ${answer}`);
        
        revalidatePath(path)

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase();

        const { answerId, userId, hasupVoted, hasdownVoted, path } = params

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } }
        } else if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } }
        } else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })

        if (!answer) {
            throw new Error('Answer not found')
        }
        // console.log(`log from answer.action.ts from downvoteAnswer ${answer}`);
        
        revalidatePath(path)

    } catch (error) {
        console.log(error);
        throw error;
    }
}