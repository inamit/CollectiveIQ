import logging
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from app.settings import settings


logger = logging.getLogger('uvicorn.error')

class Model:
    def __init__(self):
        try:
            self.model = SentenceTransformer(settings.MODEL_NAME)
            # Use Inner Product (IP) index for cosine similarity with normalized vectors
            self.index = faiss.IndexFlatIP(settings.MODEL_EMBEDDING_DIM)
            self.posts = []
            logger.info(f"Model initialized with {settings.MODEL_NAME}")
        except Exception as e:
            logger.error(f"Failed to initialize model: {e}")
            raise

    def add_posts_to_index(self, posts):
        if not posts:
            logger.warning("No posts provided to add to index")
            return
            
        try:
            texts = [f"{post.get('title', '').strip()} {post.get('content', '').strip()}" for post in posts]
            # Filter out empty texts
            valid_posts = [(text, post) for text, post in zip(texts, posts) if text.strip()]
            
            if not valid_posts:
                logger.warning("No valid posts with content to add to index")
                return
                
            valid_texts, valid_posts_data = zip(*valid_posts)
            embeddings = self.model.encode(list(valid_texts), convert_to_numpy=True)
            
            # Ensure embeddings have correct dimension
            if embeddings.shape[1] != settings.MODEL_EMBEDDING_DIM:
                logger.error(f"Embedding dimension mismatch: got {embeddings.shape[1]}, expected {settings.MODEL_EMBEDDING_DIM}")
                return
            
            # Normalize embeddings for cosine similarity
            embeddings = embeddings.astype(np.float32)
            faiss.normalize_L2(embeddings)
            
            self.index.add(embeddings)
            self.posts.extend(valid_posts_data)
            logger.info(f"Added {len(valid_posts_data)} posts to the index")
            
        except Exception as e:
            logger.error(f"Error adding posts to index: {e}")
            raise

    def get_index_size(self):
        """Return the number of posts in the index."""
        return self.index.ntotal


model = Model()
