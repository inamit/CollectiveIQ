import { Request, Response } from "express";
import mongoose, { Model } from "mongoose";

type ReactionType = "likes" | "dislikes";
type Reactable = Document & {
    likes?: mongoose.Types.ObjectId[];
    dislikes?: mongoose.Types.ObjectId[];
    save: () => Promise<any>;
};

export const toggleReaction = async (
    req: Request,
    res: Response,
    reactionType: ReactionType,
    model: Model<any> // Post or Comment model
) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;

    try {
        const item = await model.findById(itemId).exec() as Reactable;
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        applyReaction(reactionType, item, userId);

        await item.save();

        res.status(200).json({
            message: `${reactionType} toggled successfully.`,
            likesAmount: item.likes?.length,
            dislikesAmount: item.dislikes?.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

function applyReaction(
    reactionType: ReactionType,
    item: Reactable,
    userId: string
) {
    const currentArray = reactionType === "likes" ? item.likes : item.dislikes;
    const oppositeArray = reactionType === "likes" ? item.dislikes : item.likes;

    const alreadyReacted = currentArray?.some((id) => String(id) === String(userId));

    if (alreadyReacted) {
        if (currentArray) {
            item[reactionType] = currentArray.filter((id) => !id.equals(userId));
        }
    } else {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        currentArray?.push(userObjectId);
        item[reactionType === "likes" ? "dislikes" : "likes"] = oppositeArray?.filter(
            (id) => !id.equals(userId)
        );
    }
}
