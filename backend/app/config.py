import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Monolith Legacy Engine API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    PARSER_JAR_PATH: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../parser-sidecar/target/parser-sidecar-1.0.0.jar")
    )
    JAVA_HOME: str = os.environ.get("JAVA_HOME", r"C:\Program Files\Java\jdk-17")
    ANTHROPIC_API_KEY: str = os.environ.get("ANTHROPIC_API_KEY", "")
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")

    class Config:
        env_file = ".env"

settings = Settings()
