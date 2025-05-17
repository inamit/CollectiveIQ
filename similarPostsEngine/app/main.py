import logging
from idlelib.query import Query

from fastapi import FastAPI, Body
from contextlib import asynccontextmanager

from app.input.addPostInput import AddPostInput
from app.input.similarPostsInput import SimilarPostsInput
from app.ml.model import model
from app.db.postsService import fetch_posts_from_db, fetch_post_by_id
from app.ml.similarity import find_similar_posts

logger = logging.getLogger('uvicorn.error')


@asynccontextmanager
async def lifespan(app: FastAPI):
    posts = fetch_posts_from_db()
    model.add_posts_to_index(posts)
    yield


app = FastAPI(lifespan=lifespan)


@app.get("/similar-posts")
async def similar_posts(params: SimilarPostsInput = Query(...)):
    query_text = f"{params.title} {params.content}"
    return find_similar_posts(query_text, params.top_k)


@app.post("/add-post")
async def add_post(body: AddPostInput = Body(...)):
    new_post = fetch_post_by_id(body.post_id)
    model.add_posts_to_index([new_post])
    return {"message": "Post added successfully"}
