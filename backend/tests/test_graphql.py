import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


client = TestClient(app)


def setup_module():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def teardown_module():
    Base.metadata.drop_all(bind=engine)

    if os.path.exists("test.db"):
        os.remove("test.db")


def test_create_task():
    response = client.post(
        "/graphql",
        json={
            "query": """
                mutation {
                  createTask(
                    title: "Finish resume today"
                    notes: "Update project section"
                  ) {
                    id
                    title
                    priority
                    tag
                    completed
                  }
                }
            """
        },
    )

    assert response.status_code == 200

    body = response.json()
    task = body["data"]["createTask"]

    assert task["title"] == "Finish resume today"
    assert task["priority"] == "high"
    assert task["tag"] == "work"
    assert task["completed"] is False


def test_get_tasks():
    response = client.post(
        "/graphql",
        json={
            "query": """
                query {
                  tasks {
                    id
                    title
                    completed
                  }
                }
            """
        },
    )

    assert response.status_code == 200

    tasks = response.json()["data"]["tasks"]

    assert len(tasks) == 1
    assert tasks[0]["title"] == "Finish resume today"


def test_toggle_task():
    response = client.post(
        "/graphql",
        json={
            "query": """
                mutation {
                  toggleTask(taskId: 1) {
                    id
                    completed
                  }
                }
            """
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["toggleTask"]["completed"] is True


def test_delete_task():
    response = client.post(
        "/graphql",
        json={
            "query": """
                mutation {
                  deleteTask(taskId: 1)
                }
            """
        },
    )

    assert response.status_code == 200
    assert response.json()["data"]["deleteTask"] is True