"use server"

import { User } from "@/database/user.model"
import { connectToDatabase } from "../mongoose"

export async function getUserById(params: any){
    try{
        connectToDatabase()

        const {clerkUserId} = params

        const user  = await User.findOne({clerkId:clerkUserId})

        return user
    }catch(error){
        console.log(error);
        throw error
    }
}