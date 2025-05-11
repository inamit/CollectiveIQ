from sentence_transformers import SentenceTransformer
import faiss
from app.settings import settings


class Model:
    def __init__(self):
        self.model = SentenceTransformer(settings.MODEL_NAME)
        self.index = faiss.IndexFlatL2(settings.MODEL_EMBEDDING_DIM)
        self.posts = []

    def add_posts_to_index(self, posts):
        texts = [f"{post['title']} {post['content']}" for post in posts]
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        self.index.add(embeddings)
        self.posts.extend(posts)


model = Model()
