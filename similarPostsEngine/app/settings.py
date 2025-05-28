from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    MODEL_NAME: str
    MODEL_EMBEDDING_DIM: int

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
