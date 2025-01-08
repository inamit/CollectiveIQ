import { Request, Response } from "express";
import { handleMongoQueryError } from "../middleware/db/db";
import Post, { IPost, POST_RESOURCE_NAME } from "../models/posts_model";

const getPosts = async (req: Request, res: Response): Promise<any> => {
  const { sender }: { sender?: string } = req.query;

  try {
    let posts: IPost[] | null = await (sender
      ? Post.find({ sender: sender })
      : Post.find());
    return res.json(posts);
  } catch (err: any) {
    console.warn("Error fetching posts:", err);
    return handleMongoQueryError(res, err);
  }
};

const saveNewPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const post = new Post({
      content: req.body.content,
      sender: req.params.userId,
    });
    const savedPost: IPost = await post.save();
    return res.json(savedPost);
  } catch (err: any) {
    console.warn("Error saving post:", err);
    return handleMongoQueryError(res, err, POST_RESOURCE_NAME);
  }
};

const getPostById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;

  try {
    const post: IPost | null = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (err: any) {
    console.warn("Error fetching post:", err);
    return handleMongoQueryError(res, err);
  }
};

const updatePostById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { post_id }: { post_id?: string } = req.params;
  const { content }: { content?: string; } = req.body;

  try {
    if (!content) {
      return res
        .status(400)
        .json({ error: "Content is required." });
    }

    const updatedPost: IPost | null = await Post.findByIdAndUpdate(
      post_id,
      { content, sender: req.params.userId },
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

export default {
  getPosts,
  saveNewPost,
  getPostById,
  updatePostById,
};
