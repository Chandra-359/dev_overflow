import { Schema, model, Document, models } from 'mongoose';

export interface IAnswer extends Document {
    question: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    content: string;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
    question: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Question",
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);