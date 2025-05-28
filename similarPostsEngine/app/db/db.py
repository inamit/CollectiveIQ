import logging
from pymongo import MongoClient
from urllib.parse import quote_plus

from app.settings import settings

logger = logging.getLogger('uvicorn.error')


class MongoDBConnection:
    _instance = None

    def __init__(self):
        if MongoDBConnection._instance is not None:
            raise Exception("Singleton cannot be instantiated more than once!")
        else:
            try:
                logger.info("Connecting to MongoDB...")
                mongouri = f"mongodb://{quote_plus(settings.DB_USERNAME)}:{quote_plus(settings.DB_PASSWORD)}@{settings.DB_HOST}:{settings.DB_PORT}"
                self.client = MongoClient(mongouri)
                self.db = self.client[settings.DB_NAME]
                logger.info("Connected to DB")
                MongoDBConnection._instance = self
            except Exception as e:
                logger.fatal("Couldn't connect to MongoDB: %s", e)
                self.client = None
                self.db = None
                raise

    @staticmethod
    def instance():
        if MongoDBConnection._instance is None:
            MongoDBConnection()
        return MongoDBConnection._instance

    def get_db(self):
        return self.db

    def close_connection(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")
            MongoDBConnection._instance = None
