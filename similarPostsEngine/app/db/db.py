import logging
from pymongo import MongoClient

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
                self.client = MongoClient(settings.DB_URL)
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
