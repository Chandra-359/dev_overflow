"use server"

import { User } from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetTopInteractedTagsParams, GetAllTagsParams } from "./shared.types";
import { Tag } from "@/database/tag.model";


export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDatabase();

        // const {page  =1, pageSize=20, filter, searchQuery} = params;

        const tags = await Tag.find({})

        // [
        //     {
        //       _id: new ObjectId('6607381866fb2e52a9244469'),
        //       __v: 0,
        //       createdOn: 2024-03-29T21:52:24.107Z,
        //       followers: [],
        //       name: 'css',
        //       questions: [
        //         new ObjectId('66073818bf1292f552c748f8'),
        //         new ObjectId('6608c870913e602eacd9d0b4')
        //       ]
        //     }
        //   ]

        if (!tags) throw new Error("Tags not found");
        console.log(tags);
        

        return {tags}

    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getTopInteractedTag(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();

        // const { userId, limit = 3 } = params;
        const { userId } = params;

        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        // Find the interaction for the user and group by tags...
        // Interaction model must be created to get hte interaction of the user with the tags

        return [{ _id: '1', name: 'tag1' }, { _id: '2', name: 'tag2' }, { _id: '3', name: 'tag3' }]

    } catch (error) {
        console.log(error);
        throw error;
    }
}