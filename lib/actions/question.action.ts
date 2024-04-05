"use server"

import { Question } from "@/database/question.model";
import { connectToDatabase } from "../mongoose"
import { Tag } from "@/database/tag.model";
import { User } from "@/database/user.model";
import { CreateQuestionParams, GetQuestionsParams, GetQuestionByIdParams, QuestionVoteParams, DeleteQuestionParams, EditQuestionParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import { Answer } from "@/database/answer.model";
import { Interaction } from "@/database/interaction.model";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();

        const { title, content, tags, author, path } = params;

        // create a new question
        // Creating the docuemnt in the database
        const question = await Question.create({
            title,
            content,
            author,
        })

        const tagDocuments = [];

        // Create the tags or get them if they already exist
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                { upsert: true, new: true }
            )
            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagDocuments } } });

        // Create an interaction record for the user's ask_question action

        // Increment author's reputation by +5 for creating a question
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

        revalidatePath(path)

    } catch (error) {
        console.log(error);
    }

}

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const questions = await Question.find()
            .populate({ path: 'author', model: User })
            .populate({ path: 'tags', model: Tag })
            .sort({ createdAt: -1 })

        return { questions };
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        await connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById({ _id: questionId })
            .populate({ path: 'tags', model: Tag, select: '_id name' })
            .populate({ path: 'author', model: User, select: '_id clerkId name avatar' })
        // console.log(question);

        return { question }
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        await connectToDatabase();

        const { questionId, userId, hasupVoted, hasdownVoted, path } = params

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } }
        } else if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId }, $push: { upvotes: userId } }
        } else {
            updateQuery = { $addToSet: { upvotes: userId } }
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true })

        if (!question) {
            throw new Error('Question not found')
        }
        // console.log(`log from question.action.ts from upvoteQuestion ${question}`);

        revalidatePath(path)

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        await connectToDatabase();

        const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } }
        } else if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId }, $push: { downvotes: userId } }
        } else {
            updateQuery = { $addToSet: { downvotes: userId } }
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, { new: true });

        if (!question) {
            throw new Error('Question not found')
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        await connectToDatabase();

        const { questionId, path } = params;
        console.log(questionId);
        

        await Question.deleteOne({_id: questionId});

        // Delete related comments and answers as well
        await Answer.deleteMany({question: questionId});
        await Interaction.deleteMany({question: questionId})
        await Tag.updateMany({questions: questionId}, {$pull: {questions: questionId}})

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
      connectToDatabase();
  
      const { questionId, title, content, path } = params;
  
      const question = await Question.findById(questionId).populate("tags");
  
      if(!question) {
        throw new Error("Question not found");
      }
  
      question.title = title;
      question.content = content;
  
      await question.save();
  
      revalidatePath(path);
    } catch (error) {
      console.log(error);
    }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
            .sort({ views: -1, upvotes: -1 })
            .limit(5)

        return hotQuestions;
    } catch (error) {
        console.log(error);
        throw error;
    }
}