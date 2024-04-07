"use server"

import { Answer } from "@/database/answer.model";
import { connectToDatabase } from "../mongoose"
import { AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams } from "./shared.types";
import { User } from "@/database/user.model";
import { Question } from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { Interaction } from "@/database/interaction.model";


export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase();
        const { content, author, question, path } = params;

        // Create a new answer
        const newAnswer = await Answer.create({ content, author, question });

        // TODO: Append the answerID to the question's answers array
        const questionObj = await Question.findByIdAndUpdate(question, { $push: { answers: newAnswer._id } });

        // Create Interaction record for the answer
        await Interaction.create({
            user: author,
            action: "answer",
            question,
            answer: newAnswer._id,
            tags: questionObj.tags
        })

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
    try {
        connectToDatabase();

        const { questionId, sortBy, page=1, pageSize=10} = params;

        const skipAmount = (page - 1) * pageSize;

        let sortOptions = {};

        switch (sortBy) {
            case "highestUpvotes":
                sortOptions = { upvotes: -1 }
                break;
            case "lowestUpvotes":
                sortOptions = { upvotes: 1 }
                break;
            case "recent":
                sortOptions = { createdAt: -1 }
                break;
            case "old":
                sortOptions = { createdAt: 1 }
                break;

            default:
                break;
        }




        const answers = await Answer
            .find({ question: questionId })
            .populate("author", "_id clerkId name avatar")
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions)
        // console.log(answers);

        const totalAnswers = await Answer.countDocuments({ question: questionId });

        const isNext = totalAnswers > skipAmount + answers.length;

        return { answers, isNext };
    } catch (error) {
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

        // Increment userId reputation
        await User.findByIdAndUpdate(userId, { $inc: { reputation: hasupVoted ? -2 : 2} });

        // Increment author reputation
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: hasupVoted ? -10 : 10} });

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

        // Increment userId reputation
        await User.findByIdAndUpdate(userId, { $inc: { reputation: hasdownVoted ? -2 : 2} });

        // Increment author reputation
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: hasdownVoted ? -10 : 10} });

        revalidatePath(path)

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        await connectToDatabase();

        const { answerId, path } = params;

        const answer = await Answer.findById(answerId);
        if (!answer) {
            throw new Error('Answer not found')
        }
        // console.log(`answer: ${answer}`);
        // console.log(answerId);

        // console.log(`answer.question: ${answer.question}`)


        await Answer.deleteOne({ _id: answerId });
        await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId } });

        // const updatedQuestion = await Question.findById(answer.question);
        // console.log(`updated question: ${updatedQuestion}`);

        await Interaction.deleteMany({ answer: answerId });

        revalidatePath(path)
    } catch (err) {
        console.log(err);
        throw err;
    }
}