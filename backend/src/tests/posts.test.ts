import request from "supertest";
import initApp from "../server";
import mongoose, { Types } from "mongoose";
import { Express } from "express";
import postsModel, { IPost } from "../models/posts_model";
import usersModel, { IUser } from "../models/users_model";
import authMiddleware from "../middleware/auth/authMiddleware";
import path from "path";
import Post from "../models/posts_model";

let app: Express;

jest.mock("../middleware/auth/authMiddleware");

let testUser: IUser = {
  username: "test",
  email: "test@test.com",
  password: "password",
};

let testPosts: { title: string; content: string; userId?: Types.ObjectId }[] = [
  { title: "First post title", content: "First post" },
  { title: "Second post title", content: "Second post" },
  { title: "Third post title", content: "Third post" },
];

beforeAll(async () => {
  app = await initApp();
  await usersModel.deleteMany();
  testUser = await usersModel.create(testUser);
  (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
    req.params.userId = testUser._id?.toString();

    next();
  });
});
beforeEach(async () => {
  await postsModel.deleteMany();
  testPosts = testPosts.map((post) => ({ ...post, userId: testUser._id! }));
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("POST /posts", () => {
  it("should create new post", async () => {
    const title = "Title";
    const content = "This is my first post!";
    const userId = testUser._id?.toString();
    const response = await request(app).post("/posts").send({
      title,
      content,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(title);
    expect(response.body.content).toBe(content);
    expect(response.body.userId).toBe(userId);
  });

  it.each([{ content: "" }, { title: "" }, {}])(
    "should return 400 when parameter is missing (%o)",
    async (body: { content?: string; title?: string }) => {
      const response = await request(app).post("/posts").send(body);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    }
  );
});

describe("GET /posts", () => {
  describe("when there are no posts", () => {
    it("should return an empty array", async () => {
      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("when there are posts", () => {
    beforeEach(async () => {
      await postsModel.create(testPosts);
    });

    it("should return all posts", async () => {
      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(testPosts.length);
    });

    it("should return posts by userId", async () => {
      const expectedNumberOfPosts = testPosts.filter(
        (post) => post.userId === testUser._id
      ).length;
      const response = await request(app).get(
        `/posts?userId=${testUser._id?.toString()}`
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((post: IPost) => {
        expect(post.userId).toBe(testUser._id?.toString());
      });
      expect(response.body).toHaveLength(expectedNumberOfPosts);
    });
  });

  describe("mongo failure", () => {
    it("should return 500 when there is a server error", async () => {
      jest
        .spyOn(postsModel, "find")
        .mockRejectedValue(new Error("Server error"));

      const response = await request(app).get("/posts");

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("GET /posts/:post_id", () => {
  let savedPosts: IPost[] = [];
  beforeEach(async () => {
    savedPosts = await postsModel.create(testPosts);
  });

  it("should return 404 when post is not found", async () => {
    const response = await request(app).get("/posts/673b7bd1df3f05e1bdcf5320");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is invalid", async () => {
    const response = await request(app).get("/posts/invalid_id");

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return post by id", async () => {
    const post = savedPosts[0];
    const response = await request(app).get(`/posts/${post._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(JSON.parse(JSON.stringify(post)));
  });
});

describe("DELETE /posts/:post_id", () => {
  let savedPosts: IPost[] = [];
  beforeEach(async () => {
    savedPosts = await postsModel.create(testPosts);
  });

  it("should return 404 when post is not found", async () => {
    const response = await request(app).delete("/posts/673b7bd1df3f05e1bdcf0000");

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should delete post by id", async () => {
    const post = savedPosts[0];
    const response = await request(app).delete(`/posts/${post._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Post deleted successfully");

  });
});

describe("PUT /posts/:post_id", () => {
  let savedPosts: IPost[] = [];
  beforeEach(async () => {
    savedPosts = await postsModel.create(testPosts);
  });

  it("should return 404 when post is not found", async () => {
    const response = await request(app)
      .put("/posts/673b7bd1df3f05e1bdcf5320")
      .send({
        content: "Updated post",
        userId: testUser._id,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is invalid", async () => {
    const response = await request(app).put("/posts/invalid_id").send({
      content: "Updated post",
      userId: testUser._id,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when content is missing", async () => {
    const post = savedPosts[0];
    const response = await request(app).put(`/posts/${post._id}`).send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should update post by id", async () => {
    const post = savedPosts[0];
    const updatedContent = "Updated content";
    const updateduserId = testUser._id?.toString();
    const response = await request(app)
      .put(`/posts/${post._id}`)
      .send({ content: updatedContent });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(updatedContent);
    expect(response.body.userId).toBe(updateduserId);
  });
});



describe("File Tests", () => {
  test("upload file", async () => {
    const filePath = path.resolve(__dirname, `amit.jpg`);

    try {
      const response = await request(app)
        .post("/posts/image")
        .attach("file", filePath);
      expect(response.statusCode).toEqual(200);
      let url = response.body.url;
      url = url.replace(/^.*\/\/[^/]+/, "");
      const res = await request(app).get(url);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  });
});

describe("Post Reactions API - Like and Dislike", () => {
  let savedPost: IPost;
  beforeEach(async () => {
    savedPost = await postsModel.create(testPosts[0]);
  });

  it("should allow a user to like a post", async () => {
    const response = await request(app)
      .post(`/posts/${savedPost._id}/like`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.likesAmount).toBe(1);
    expect(response.body.dislikesAmount).toBe(0);

    const updatedPost: IPost = (await Post.findById(savedPost._id)) as IPost;
    expect(updatedPost?.likes).toContainEqual(testUser._id);
  });

  it("should allow a user to dislike a post", async () => {
    const response = await request(app)
      .post(`/posts/${savedPost._id}/dislike`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.likesAmount).toBe(0);
    expect(response.body.dislikesAmount).toBe(1);

    const updatedPost: IPost = (await Post.findById(savedPost._id)) as IPost;
    expect(updatedPost?.dislikes).toContainEqual(testUser._id);
  });

  it("should remove like if user likes a post again", async () => {
    // Like the post initially
    await request(app).post(`/posts/${savedPost._id}/like`).send();

    // Like the post again
    const response = await request(app)
      .post(`/posts/${savedPost._id}/like`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.likesAmount).toBe(0);

    const updatedPost: IPost = (await Post.findById(savedPost._id)) as IPost;
    expect(updatedPost?.likes).not.toContainEqual(testUser._id);
  });

  it("should remove dislike if user dislikes a post again", async () => {
    // Dislike the post initially
    await request(app).post(`/posts/${savedPost._id}/dislike`).send();

    // Dislike the post again
    const response = await request(app)
      .post(`/posts/${savedPost._id}/dislike`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.dislikesAmount).toBe(0);

    const updatedPost: IPost = (await Post.findById(savedPost._id)) as IPost;
    expect(updatedPost?.dislikes).not.toContainEqual(testUser._id);
  });

  it("should switch from like to dislike", async () => {
    // Like the post initially
    await request(app).post(`/posts/${savedPost._id}/like`).send();

    // Dislike the post
    const response = await request(app)
      .post(`/posts/${savedPost._id}/dislike`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.likesAmount).toBe(0);
    expect(response.body.dislikesAmount).toBe(1);

    const updatedPost: IPost = (await Post.findById(savedPost._id)) as IPost;
    expect(updatedPost?.likes).not.toContainEqual(testUser._id);
    expect(updatedPost?.dislikes).toContainEqual(testUser._id);
  });

  it("should return 404 if post is not found", async () => {
    const notFound = new mongoose.Types.ObjectId();
    const response = await request(app).post(`/posts/${notFound}/like`).send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found");
  });
});
