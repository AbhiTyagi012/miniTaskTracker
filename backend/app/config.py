from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_url: str
    db_name: str = "minitasktracker"

    class Config:
        env_file = ".env"


settings = Settings()
