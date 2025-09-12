from pydantic import BaseModel


class SimilarPostInput(BaseModel):
    title: str
    content: str