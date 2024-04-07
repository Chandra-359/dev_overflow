"use server"

import { User } from "@/database/user.model"
import { Question } from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, GetUserByIdParams, UpdateUserParams, DeleteUserParams, GetAllUsersParams, ToggleSaveQuestionParams, GetSavedQuestionsParams, GetUserStatsParams } from "./shared.types"
import { revalidatePath } from "next/cache"
import { Tag } from "@/database/tag.model"
import { Answer } from "@/database/answer.model"
import { FilterQuery } from "mongoose"
// import { FilterQuery } from "mongoose"

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();

        const { searchQuery, filter, page=1, pageSize=10 } = params;

        // Calculate the skip value
        const skipAmount = (page - 1) * pageSize;
        
        const query: FilterQuery<typeof User> = {};

        let sortOptions = {};

        switch (filter) {
            case "new_users":
                sortOptions = { joinedAt: -1 }
                break;
            case "old_users":
                sortOptions = { joinedAt: 1 }
                break;
            case "top_contributors":
                sortOptions = { reputation: -1 }
                break;

            default:
                break;
        }


        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        const allUsers = await User.find(query)
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions);
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

        const totalUsers = await User.countDocuments(query);

        const isNext = totalUsers > skipAmount + allUsers.length;


        return { allUsers, isNext };

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

        const { clerkId, searchQuery,filter,page=1,pageSize=10 } = params;

        const skipAmount = (page - 1) * pageSize;


        const query: FilterQuery<typeof Question> = {}

        let sortOptions = {}

        switch (filter) {
            case "most_recent":
              sortOptions = { createdAt: -1 }
              break;
            case "oldest":
              sortOptions = { createdAt: 1 } // ascending order
              break;
            case "most_voted":
              sortOptions = { upvotes: -1 } // descending order
              break;
            case "most_viewed":
              sortOptions = { views: -1 }
              break;
            case "most_answered":
              sortOptions = { answers: -1 }
              break;
          
            default:
              break;
          }        

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } },
            ]
        }

        const user = await User
            .findOne({ clerkId })
            // this populate will only populated Question collection not the tags or other array details
            .populate({
                path: "saved",
                match: query,
                options:
                {
                    sort: sortOptions,
                    skip: skipAmount,
                    limit: pageSize+1
                },
                // populating to get the details in the question collection
                populate:
                    [
                        { path: "tags", model: Tag, select: "_id name" },
                        { path: "author", model: User, select: "_id clerkId name avatar" },
                    ]

            })

        const isNext = user.saved.length > pageSize;

        if (!user) {
            throw new Error("User not found")
        }

        const savedQuestions = user.saved;
        // console.log(savedQuestions);

        return { questions: savedQuestions, isNext }



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
        
        const skipAmount = (page - 1) * pageSize

        const totalQuestions = await Question.countDocuments({ author: userId })


        const userQuestions = await Question.find({ author: userId })
            .skip(skipAmount)
            .limit(pageSize)
            .sort({createdAt: -1, views: -1, upvotes: -1})
            .populate({ path: 'tags', model: Tag, select: '_id name' })
            .populate({ path: 'author', model: User, select: '_id clerkId name avatar' })

        const isNext = totalQuestions > skipAmount + userQuestions.length;

        return { totalQuestions, userQuestions, isNext }

    } catch (error) {
        console.log(error);
        throw error
    }

}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;
        
        const skipAmount = (page - 1) * pageSize

        const totalAnswers = await Answer.countDocuments({ author: userId })

        const userAnswers = await Answer.find({ author: userId })
            .skip(skipAmount)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate({ path: 'question', model: Question, select: '_id title' })
            .populate({ path: 'author', model: User, select: '_id clerkId name avatar' })
        
        const isNext = totalAnswers > skipAmount + userAnswers.length;

        return { totalAnswers, userAnswers, isNext }

    } catch (error) {
        console.log(error);
        throw error
    }

}