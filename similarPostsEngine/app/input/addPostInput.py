from pydantic import BaseModel


class AddPostInput(BaseModel):
    post_id: str
