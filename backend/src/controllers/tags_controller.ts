import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import Tag, { ITag } from "../models/tags_model";

const getAllTags = async (req: Request, res: Response): Promise<any> => {
    try {
        const tags: ITag[] | null = await Tag.find();
        return res.json(tags);
    } catch (err: any) {
        console.warn("Error fetching tags:", err);
        return handleMongoQueryError(res, err);
    }
};

const createTagsFromEnv = async (req: Request, res: Response): Promise<any> => {
    try {
        const tagsString = process.env.TAG_LIST;
        if (!tagsString) {
            return res.status(400).json({ error: "TAGS environment variable is not set." });
        }

        const tagNames = tagsString.split(",").map(name => name.trim()).filter(name => name);
        const tagDocs = tagNames.map(name => ({
            name,
            bestAi: "",
            numOfPosts: 0,
        }));

        const createdTags = await Tag.insertMany(tagDocs, { ordered: false });
        return res.status(201).json({ message: `${createdTags.length} tags created.`, tags: createdTags });
    } catch (error: any) {
        console.error("Error creating tags:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};

export default {
    getAllTags,
    createTagsFromEnv,
};