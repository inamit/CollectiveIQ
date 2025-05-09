import logging
from app.db.db import get_db

logger = logging.getLogger('uvicorn.error')


def fetch_posts_from_db():
    db = get_db()
    posts = list(db["posts"].find())
    logger.info(f"Loaded {len(posts)} posts")
    return posts


def fetch_post_by_id(post_id: str):
    db = get_db()
    return db["posts"].find_one({"_id": post_id})
