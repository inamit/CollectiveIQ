import request from "supertest";
import initApp from "../server";
import mongoose, { ObjectId, Types } from "mongoose";
import { Express } from "express";
import postsModel, { IPost } from "../models/posts_model";
import usersModel, { IUser } from "../models/users_model";
import authMiddleware from "../middleware/auth/authMiddleware";
import path from "path";

let app: Express;

jest.mock("../middleware/auth/authMiddleware");

let testUser: IUser = {
  username: "test",
  email: "test@test.com",
  password: "password",
};

let testPosts: {content: string, sender?: Types.ObjectId}[] = [
  { content: "First post" },
  { content: "Second post" },
  { content: "Third post" },
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
  testPosts = testPosts.map(post => ({...post, sender: testUser._id!}));
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("POST /posts", () => {
  it("should create new post", async () => {
    const content = "This is my first post!";
    const sender = testUser._id?.toString();
    const response = await request(app).post("/posts").send({
      content,
      sender,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.content).toBe(content);
    expect(response.body.sender).toBe(sender);
  });

  it("should return 400 when content is missing", async () => {
    const response = await request(app).post("/posts").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
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

    it("should return posts by sender", async () => {
      const expectedNumberOfPosts = testPosts.filter(
        (post) => post.sender === testUser._id
      ).length;
      const response = await request(app).get(`/posts?sender=${testUser._id?.toString()}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach((post: IPost) => {
        expect(post.sender).toBe(testUser._id?.toString());
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
        sender: testUser._id,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when post_id is invalid", async () => {
    const response = await request(app).put("/posts/invalid_id").send({
      content: "Updated post",
      sender: testUser._id,
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
    const updatedSender = testUser._id?.toString();
    const response = await request(app)
      .put(`/posts/${post._id}`)
      .send({ content: updatedContent });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe(updatedContent);
    expect(response.body.sender).toBe(updatedSender);
  });
});



describe("File Tests", () => {
  test("upload file", async () => {
    const filePath = path.resolve(__dirname,`amit.jpg`);

    try {
      const response = await request(app)
          .post("/posts/image").attach('file', filePath)
      expect(response.statusCode).toEqual(200);
      let url = response.body.url;
      url = url.replace(/^.*\/\/[^/]+/, '')
      const res = await request(app).get(url)
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  })
})
