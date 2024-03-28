import mongoose from 'mongoose'

let isConnected: boolean = false

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) {
        throw new Error('Please define the MONGODB_URL')
    }

    if (isConnected) {
        return console.log('MongoDB is  already connected!');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "DevOverFlow"
        });

        isConnected = true;
        console.log('MongoDB is connected!');

    } catch (error) {
        console.log('MongoDB connection error:', error);

    }


}