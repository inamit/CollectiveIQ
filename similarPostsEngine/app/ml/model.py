from sentence_transformers import SentenceTransformer
import faiss

model_name = "all-MiniLM-L6-v2"
embedding_dim = 384


class Model:
    def __init__(self):
        self.model = SentenceTransformer(model_name)
        self.index = faiss.IndexFlatL2(embedding_dim)
        self.posts = []

    def add_posts_to_index(self, posts):
        texts = [f"{post['title']} {post['content']}" for post in posts]
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        self.index.add(embeddings)
        self.posts.extend(posts)


model = Model()
