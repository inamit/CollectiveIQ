import logging
from pymongo import MongoClient

from app.settings import settings

logger = logging.getLogger('uvicorn.error')

def get_mongo_client():
    client = MongoClient(settings.DB_URL)
    return client


def get_db():
    logger.info("Connecting to MongoDB...")
    try:
        client = get_mongo_client()
        logger.info("Connected to DB")
        return client[settings.DB_NAME]
    except Exception as e:
        logger.fatal("Couldn't connect to MongoDB: %s", e)
        return None
