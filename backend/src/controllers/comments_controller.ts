import Post from "../models/posts_model";
import { Request, Response } from "express";
import { handleMongoQueryError } from "../db/db";
import Comment, {
  COMMENT_RESOURCE_NAME,
  IComment,
} from "../models/comments_model";
import { toggleReaction } from "./likes_controller";

const getComments = async (req: Request, res: Response): Promise<any> => {
  try {
    const { post_id }: { post_id?: string } = req.query;
    const comments: IComment[] = await (post_id
      ? Comment.find({ postID: post_id }).populate("userId")
      : Comment.find().populate("userId"));

    return res.json(comments);
  } catch (err: any) {
    console.warn("Error fetching comments:", err);
    return handleMongoQueryError(res, err);
  }
};

const getCommentsByUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId }: { userId?: string } = req.query;
    const comments: IComment[] = await Comment.find({
      userId: userId,
    }).populate("userId");

    return res.json(comments);
  } catch (err: any) {
    console.warn("Error fetching comments:", err);
    return handleMongoQueryError(res, err);
  }
};

const saveNewComment = async (req: Request, res: Response): Promise<any> => {
  const { post_id }: { post_id?: string } = req.query;

  try {
    if (!post_id) {
      return res.status(400).json({ error: "Post ID is required." });
    }

    const postExists: boolean =
      (await Post.countDocuments({ _id: post_id }).exec()) > 0;
    if (!postExists) {
      return res.status(404).json({ error: "Post not found." });
    }

    const comment = new Comment({
      postID: post_id,
      parentCommentID: req.body.parentCommentID,
      content: req.body.content,
      userId: req.params.userId,
      date: new Date(),
    });
    const savedComment: IComment = await (
      await comment.save()
    ).populate("userId");
    return res.json(savedComment);
  } catch (err: any) {
    console.warn("Error saving comment:", err);
    return handleMongoQueryError(res, err, COMMENT_RESOURCE_NAME);
  }
};

const updateCommentById = async (req: Request, res: Response): Promise<any> => {
  const { comment_id }: { comment_id?: string } = req.params;
  const { content }: { content: string } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.userId.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedComment: IComment | null = await Comment.findByIdAndUpdate(
      comment_id,
      { content, userId: req.params.userId, date: new Date() },
      { new: true, runValidators: true }
    ).populate("userId");

    return res.json(updatedComment);
  } catch (err: any) {
    console.warn("Error updating comment:", err);
    return handleMongoQueryError(res, err, COMMENT_RESOURCE_NAME);
  }
};

const deleteCommentById = async (req: Request, res: Response): Promise<any> => {
  const { comment_id }: { comment_id?: string } = req.params;

  try {
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    if (comment.userId.toString() !== req.params.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const deletedComment: IComment | null = await Comment.findByIdAndDelete(
      comment_id
    );

    return res.json(deletedComment);
  } catch (err: any) {
    console.warn("Error deleting comment:", err);
    return handleMongoQueryError(res, err);
  }
};

export const deleteCommentsByPostId = async (post_Id: string) => {
  try {
    const result = await Comment.deleteMany({ postID: post_Id });
    return result
  } catch (err: any) {
    console.warn("Error deleting comment:", err);
  }
};

const likeComment = async (req: Request, res: Response): Promise<any> => {
  return toggleReaction(req, res, "likes", Comment);
};

const dislikeComment = async (req: Request, res: Response): Promise<any> => {
  return toggleReaction(req, res, "dislikes", Comment);
};
export default {
  getComments,
  saveNewComment,
  updateCommentById,
  deleteCommentById,
  getCommentsByUser,
  likeComment,
  dislikeComment
};
