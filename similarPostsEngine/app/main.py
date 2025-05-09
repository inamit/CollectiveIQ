import logging
from fastapi import FastAPI, Query
from app.ml.model import model
from app.db.postsService import fetch_posts_from_db, fetch_post_by_id
from app.ml.similarity import find_similar_posts

logger = logging.getLogger('uvicorn.error')

app = FastAPI()


@app.on_event("startup")
async def startup():
    posts = fetch_posts_from_db()
    model.add_posts_to_index(posts)


@app.get("/similar-posts")
async def similar_posts(title: str = Query(...), content: str = Query(...), top_k: int = 5):
    query_text = f"{title} {content}"
    return find_similar_posts(query_text, top_k)


@app.post("/add-post")
async def add_post(post_id: str = Query(...)):
    new_post = fetch_post_by_id(post_id)
    model.add_posts_to_index(list(new_post))
    return {"message": "Post added successfully"}
