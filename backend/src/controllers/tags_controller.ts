import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import Tag, { ITag } from "../models/tags_model";
import Comment from "../models/comments_model";
import cron from 'node-cron';

cron.schedule('0 0 * * *', () => { //*/5 * * * *
    console.log('Running recalcuation of the best AI');
    aggragateBestAiModelPerTag();
});

const getAllTags = async (req: Request, res: Response): Promise<any> => {
    try {
        const tags: ITag[] | null = await Tag.find();
        return res.json(tags);
    } catch (err: any) {
        console.warn("Error fetching tags:", err);
        return handleMongoQueryError(res, err);
    }
};

const getTagByName = async (req: Request, res: Response): Promise<any> => {
    try {
        const { tagName }: { tagName?: string } = req.query;
        const tag: ITag[] | null = await Tag.findOne({ name: tagName });
        if (!tag) {
            return res.status(400).json({ error: "Tag is not found!" });
        }
        return res.json(tag);
    } catch (err: any) {
        console.warn("Error fetching tag:", err);
        return handleMongoQueryError(res, err);
    }
};

export const initTagsList = async () => {
    try {
        const tagsString = process.env.TAG_LIST;
        if (!tagsString) {
            console.warn("TAGS environment variable is not set.")
        } else {
            const existedTags = await Tag.find();
            const existedTagNames = existedTags.map(tag => tag.name);

            const allTags = tagsString.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);
            const newTagNames = allTags.filter(tag => !existedTagNames.includes(tag));

            const tagDocs = newTagNames.map(name => ({ name }));
            const createdTags = await Tag.insertMany(tagDocs);
        }
    } catch (error: any) {
        console.warn("Error creating tags:", error);
    }
};

export const updateNumberOfPosts = async (tag: string | undefined) => {
    try {
        const tagName = tag?.toLowerCase();
        const result = await Tag.updateOne(
            { name: tagName },
            { $inc: { numOfPosts: 1 } }
        );
    } catch (error) {
        console.error('Error updating the item:', error);
    }
}

const aggragateBestAiModelPerTag = async () => {
    try {
        const tags = await Tag.find();
        for (const tag of tags) {
            const result = await aggragateTag(tag);
            if (result[0]) {
                const bestAiUserId = result[0]._id.toString();
                await Tag.updateOne({ _id: tag._id }, { $set: { bestAi: bestAiUserId } });
            }
        }
    } catch (error) {
        console.error("Error updating best AI for all tags:", error);
    }
};

const aggragateTag = async (tag: ITag): Promise<any[]> => {
    return await Comment.aggregate([
        {
            $lookup: {
                from: "posts",
                localField: "postID",
                foreignField: "_id",
                as: "post"
            }
        },
        { $unwind: "$post" },
        {
            $match: {
                "post.tag": tag.name
            }
        },
        {
            $group: {
                _id: "$userId",
                totalLikes: { $sum: { $size: "$likes" } }
            }
        },
        { $sort: { totalLikes: -1 } },
        { $limit: 1 }
    ])
}
export default {
    getAllTags,
    getTagByName
};