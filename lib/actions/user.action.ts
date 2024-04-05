"use server"

import { User } from "@/database/user.model"
import { Question } from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, GetUserByIdParams, UpdateUserParams, DeleteUserParams, GetAllUsersParams, ToggleSaveQuestionParams, GetSavedQuestionsParams, GetUserStatsParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import { Tag } from "@/database/tag.model"
import { Answer } from "@/database/answer.model"
// import { FilterQuery } from "mongoose"

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();

        // const {page  =1, pageSize=20, filter, searchQuery} = params;

        const allUsers = await User.find({}).sort({ createdAt: -1 });
        // [{
        //     _id: new ObjectId('660778df0a921eb2cf9d2877'),
        //     clerkId: 'user_2eOBPxxAfLEOGjFlQ3imPAXOEKt',
        //     name: 'AWS  Practice ',
        //     username: 'olduser',
        //     email: 'practicea076@gmail.com',
        //     bio: '',
        //     avatar: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJlT0JTNmROalNQREtBWFVYQmFuU1g0QTc1bCJ9',   
        //     reputation: 0,
        //     saved: [],
        //     joinedAt: 2024-03-30T02:28:47.766Z,
        //     __v: 0
        //   }]


        return { allUsers };

    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase()

        const newUser = await User.create(userData)

        return newUser

    } catch (error) {
        console.log(error);
        throw error
    }

}

export async function getUserById(params: GetUserByIdParams) {
    try {
        connectToDatabase()

        const { clerkUserId } = params

        const user = await User.findOne({ clerkId: clerkUserId })

        return user
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function updateUserById(params: UpdateUserParams) {
    try {
        connectToDatabase()

        const { clerkId, updateData, path } = params

        await User.findOneAndUpdate({ clerkId }, updateData, { new: true })

        revalidatePath(path)

    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function deleteUserById(params: DeleteUserParams) {
    try {
        connectToDatabase()

        const { clerkId } = params

        const user = await User.findOne({ clerkId });

        if (!user) {
            throw new Error("User not found")
        }

        // delete everything related to the user from other collections
        // get user question ids
        // const userQuestionIds = await Question.find({ author: clerkId }).select('_id').distinct('_id')

        // delete user questions

        await Question.deleteMany({ author: user._id })

        // TODO: delete user answers, comments etc

        const deletedUser = await User.findByIdAndDelete(user._id);

        return deletedUser

    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase();

        const { userId, questionId, path } = params;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found")
        }

        const isQuestionSaved = user.saved.includes(questionId);
        if (isQuestionSaved) {
            // remove question from list
            await User.findByIdAndUpdate(userId, { $pull: { saved: questionId } }, { new: true });
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { saved: questionId } }, { new: true });
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error
    }

}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        connectToDatabase();

        const { clerkId } = params;

        // const query:FilterQuery<typeof Question> = searchQuery ?{title :{$regex: new RegExp(searchQuery, "i")}} : {},

        const user = await User.findOne({ clerkId })
            // this populate will only populated Question collection not the tags or other array details
            .populate({
                path: "saved",
                // match: query,
                options:
                {
                    sort: { "createdAt": -1 }
                },
                // populating to get the details in the question collection
                populate:
                    [
                        { path: "tags", model: Tag, select: "_id name" },
                        { path: "author", model: User, select: "_id clerkId name avatar" },
                    ]

            })

        if (!user) {
            throw new Error("User not found")
        }

        const savedQuestions = user.saved;
        // console.log(savedQuestions);

        return { questions: savedQuestions }



    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase();

        const { clerkUserId } = params;

        const user = await User.findOne({ clerkId: clerkUserId })

        if (!user) {
            throw new Error("User not found")
        }

        const totalQuestions = await Question.countDocuments({ author: user._id })
        const totalAnswers = await Answer.countDocuments({ author: user._id })

        return { user, totalQuestions, totalAnswers }
    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;

        const totalQuestions = await Question.countDocuments({ author: userId })

        const skip = (page - 1) * pageSize

        const userQuestions = await Question.find({ author: userId })
            .sort({ views: -1, upvotes: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate({ path: 'tags', model: Tag, select: '_id name' })
            .populate({ path: 'author', model: User, select: '_id clerkId name avatar' })

        return { totalQuestions, userQuestions }

    } catch (error) {
        console.log(error);
        throw error
    }

}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;

        const totalAnswers = await Answer.countDocuments({ author: userId })

        const skip = (page - 1) * pageSize

        const userAnswers = await Answer.find({ author: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .populate({ path: 'question', model: Question, select: '_id title' })
            .populate({ path: 'author', model: User, select: '_id clerkId name avatar' })

        return { totalAnswers, userAnswers }

    } catch (error) {
        console.log(error);
        throw error
    }

}