from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_URL: str
    DB_NAME: str
    MODEL_NAME: str
    MODEL_EMBEDDING_DIM: int

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()