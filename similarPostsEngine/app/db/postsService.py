import logging
from app.db.db import get_db
from bson.objectid import ObjectId

logger = logging.getLogger('uvicorn.error')


def fetch_posts_from_db():
    db = get_db()
    posts = list(db["posts"].find())
    logger.info(f"Loaded {len(posts)} posts")
    return posts


def fetch_post_by_id(post_id: str):
    logger.info(f"Loading post {post_id} from DB")
    db = get_db()
    post = db["posts"].find_one(ObjectId(post_id))
    logger.info(f"Loaded post. Post: {post}")
    return post
