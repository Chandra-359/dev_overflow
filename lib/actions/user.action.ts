"use server"

import { User } from "@/database/user.model"
import { Question } from "@/database/question.model"
import { connectToDatabase } from "../mongoose"
import { CreateUserParams, GetUserByIdParams, UpdateUserParams, DeleteUserParams, GetAllUsersParams } from "./shared.types"
import { revalidatePath } from "next/cache"

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
        
        
        return {allUsers};
        
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