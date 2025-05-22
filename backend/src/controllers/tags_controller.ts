import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import Tag, { ITag } from "../models/tags_model";
import Post from "../models/posts_model";
import Comment from "../models/comments_model";
import User from "../models/users_model";

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

const initTagsList = async (req: Request, res: Response): Promise<any> => {
    try {
        const tagsString = process.env.TAG_LIST;
        if (!tagsString) {
            return res.status(400).json({ error: "TAGS environment variable is not set." });
        }

        const tagsNames = tagsString.split(",").map(tag => tag.trim()).filter(tag => tag);
        const tagDocs = tagsNames.map(tag => ({
            tag,
        }));

        const createdTags = await Tag.insertMany(tagDocs);
        return res.status(201).json({ message: `${createdTags.length} tags created.`, tags: createdTags });
    } catch (error: any) {
        console.warn("Error creating tags:", error);
        return handleMongoQueryError(res, error);
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

const aggragateBestAiModelPerTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const tags = await Tag.find();

        for (const tag of tags) {
            const result = await Comment.aggregate([
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
            ]);
            console.log(`the result for ${tag.name} is - ${result.length}`);
            if (result.length > 0) {
                const bestAiUserId = result[0]._id.toString();
                await Tag.updateOne({ _id: tag._id }, { $set: { bestAi: bestAiUserId } });
            } else {
                console.log(`No AI comments found for tag '${tag.name}'`);
            }
        }

        res.status(200).json({ message: "Best AI updated for all tags." });
    } catch (error) {
        console.error("Error updating best AI for all tags:", error);
        res.status(500).json({ error: "Failed to update best AI for tags." });
    }
};


export default {
    getAllTags,
    initTagsList,
    aggragateBestAiModelPerTag,
    getTagByName
};