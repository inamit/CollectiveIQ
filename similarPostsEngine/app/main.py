import logging

from fastapi import FastAPI, Query, Body
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse

from app.db.db import MongoDBConnection
from app.input.addPostInput import AddPostInput
from app.ml.model import model
from app.db.postsService import fetch_posts_from_db, fetch_post_by_id
from app.ml.similarity import find_similar_posts
from app.util.mongoHelper import fix_mongo_types
from app.settings import settings
from app.input.similarPostInput import SimilarPostInput

logger = logging.getLogger('uvicorn.error')


@asynccontextmanager
async def lifespan(app: FastAPI):
    posts = fetch_posts_from_db()
    model.add_posts_to_index(posts)
    yield
    MongoDBConnection.instance().close_connection()


app = FastAPI(lifespan=lifespan)


@app.post("/similar-posts")
async def similar_posts(
    post: SimilarPostInput = Body(...),
    top_k: int = 5,
    similarity_threshold: float = Query(0.5, ge=0.0, le=1.0)
):
    """
    Find similar posts based on title and content using cosine similarity.
    
    Args:
        title: Post title
        content: Post content
        top_k: Maximum number of results (default: 5)
        similarity_threshold: Minimum cosine similarity score (0-1, default: 0.5)
    """
    query_text = f"{post.title} {post.content}"
    posts = find_similar_posts(query_text, top_k, similarity_threshold)
    return JSONResponse(content=fix_mongo_types(posts))


@app.post("/add-post")
async def add_post(body: AddPostInput = Body(...)):
    new_post = fetch_post_by_id(body.post_id)
    model.add_posts_to_index([new_post])
    return {"message": "Post added successfully"}
