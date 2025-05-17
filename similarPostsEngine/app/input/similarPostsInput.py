from pydantic import BaseModel


class SimilarPostsInput(BaseModel):
    title: str
    content: str
    top_k: int = 5
