"use server"

import { User } from "@/database/user.model"
import { Question } from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, GetUserByIdParams, UpdateUserParams, DeleteUserParams } from "./shared.types"
import { revalidatePath } from "next/cache"


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

        const user = await User.findOne({clerkId});

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