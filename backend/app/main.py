from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from .database import Base, engine
from .schema import schema

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Notes API")

graphql_app = GraphQLRouter(schema)

app.include_router(graphql_app, prefix="/graphql")


@app.get("/")
def root():
    return {
        "message": "Task Notes API is running!",
        "graphql": "/graphql",
    }