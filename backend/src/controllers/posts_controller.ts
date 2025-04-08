import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import Post, { IPost, POST_RESOURCE_NAME } from "../models/posts_model";
import mongoose from "mongoose";
import { saveFile } from "../middleware/file-storage/file-storage-middleware";
import { getGeminiResponse, getFalconResponse, getMistralResponse } from "../services/aiService";

const getPosts = async (req: Request, res: Response): Promise<any> => {
  const { userId }: { userId?: string } = req.query;

  try {
    let posts: IPost[] | null = await (userId
      ? Post.find({ userId: userId }).populate("userId")
      : Post.find().populate("userId"));
    return res.json(posts);
  } catch (err: any) {
    console.warn("Error fetching posts:", err);
    return handleMongoQueryError(res, err);
  }
};

const triggerAIResponses = async (content: string, postId: string): Promise<void> => {
  try {
    await Promise.all([
      getGeminiResponse(content, postId),
      getFalconResponse(content, postId),
      getMistralResponse(content, postId),
    ]);
    console.log("AI responses successfully triggered for post:", postId);
  } catch (error) {
    console.error("Error triggering AI responses for post:", postId, error);
  }
};

const saveNewPost = async (req: Request, res: Response): Promise<any> => {
  try {
    let imageUrl;
    if (process.env.BASE_URL && req.file?.path) {
      imageUrl = process.env.BASE_URL + req.file.path;
    }
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      userId: req.params.userId,
      date: new Date(),
      imageUrl,
    });
    const savedPost: IPost = await (await post.save()).populate("userId");

    triggerAIResponses(savedPost.content, String(savedPost._id));

    return res.json(savedPost);
  } catch (err: any) {
    console.warn("Error saving post:", err);
    return handleMongoQueryError(res, err, POST_RESOURCE_NAME);
  }
};

const deletePostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.userId.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(post_id);

    return res.json({ message: "Post deleted successfully" });
  } catch (err: any) {
    console.warn("Error deleting post:", err);
    return handleMongoQueryError(res, err, POST_RESOURCE_NAME);
  }
};

const getPostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;

  try {
    const post: IPost | null = await Post.findById(post_id).populate("userId");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (err: any) {
    console.warn("Error fetching post:", err);
    return handleMongoQueryError(res, err);
  }
};

const updatePostById = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;
  const { content, title }: { content?: string; title?: string } = req.body;

  try {
    if (!content && !title) {
      return res.status(400).json({ error: "Content or title is required." });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.userId.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    let imageUrl;
    if (process.env.BASE_URL && req.file?.path) {
      imageUrl = process.env.BASE_URL + req.file.path;
    }

    const updatedPost: IPost | null = await Post.findByIdAndUpdate(
      post_id,
      {
        title,
        content,
        userId: req.params.userId,
        date: new Date(),
        imageUrl,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.json(updatedPost);
  } catch (err: any) {
    console.warn("Error updating post:", err);
    return handleMongoQueryError(res, err, POST_RESOURCE_NAME);
  }
};

const saveImage = (req: Request, res: Response): void => {
  saveFile(req, res);
};

const likePost = async (req: Request, res: Response): Promise<any> => {
  return toggleReaction(req, res, "likes");
};

const dislikePost = async (req: Request, res: Response): Promise<any> => {
  return toggleReaction(req, res, "dislikes");
};

export const toggleReaction = async (
  req: Request,
  res: Response,
  reactionType: "likes" | "dislikes"
) => {
  const userId = req.params.userId;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    getReaction(reactionType, post, userId);

    await post.save();

    res.status(200).json({
      message: `${reactionType} toggled successfully.`,
      likesAmount: post.likes?.length,
      dislikesAmount: post.dislikes?.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function getReaction(
  reactionType: "likes" | "dislikes",
  post: IPost,
  userId: string
) {
  const currentReactionArray =
    reactionType === "likes" ? post.likes : post.dislikes;
  const oppositeReactionArray =
    reactionType === "likes" ? post.dislikes : post.likes;

  if (currentReactionArray) {
    const alreadyReacted: boolean = currentReactionArray.some(
      (id) => String(id) === String(userId)
    );
    if (alreadyReacted) {
      post[reactionType] = currentReactionArray.filter(
        (id) => !id.equals(userId)
      );
    } else {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      currentReactionArray.push(userObjectId);
      post[reactionType === "likes" ? "dislikes" : "likes"] =
        oppositeReactionArray?.filter((id) => !id.equals(userId));
    }
  }
}
export default {
  getPosts,
  saveNewPost,
  deletePostById,
  getPostById,
  updatePostById,
  saveImage,
  likePost,
  dislikePost,
};
