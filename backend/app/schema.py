from typing import List, Optional

import strawberry
from sqlalchemy.orm import Session

from .database import SessionLocal
from .llm import suggest_priority_and_tag
from .models import Task


@strawberry.type
class TaskType:
    id: int
    title: str
    notes: str
    priority: str
    tag: Optional[str]
    completed: bool


def task_to_type(task: Task) -> TaskType:
    return TaskType(
        id=task.id,
        title=task.title,
        notes=task.notes,
        priority=task.priority,
        tag=task.tag,
        completed=task.completed,
    )


@strawberry.type
class Query:
    @strawberry.field
    def tasks(self) -> List[TaskType]:
        db: Session = SessionLocal()

        try:
            tasks = db.query(Task).order_by(Task.id.desc()).all()
            return [task_to_type(task) for task in tasks]
        finally:
            db.close()


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_task(
        self,
        title: str,
        notes: str = "",
        use_suggestion: bool = True,
    ) -> TaskType:
        db: Session = SessionLocal()

        try:
            priority = "normal"
            tag = None

            if use_suggestion:
                suggestion = suggest_priority_and_tag(title, notes)
                priority = suggestion["priority"]
                tag = suggestion["tag"]

            task = Task(
                title=title,
                notes=notes,
                priority=priority,
                tag=tag,
            )

            db.add(task)
            db.commit()
            db.refresh(task)

            return task_to_type(task)
        finally:
            db.close()

    @strawberry.mutation
    def toggle_task(self, task_id: int) -> Optional[TaskType]:
        db: Session = SessionLocal()

        try:
            task = db.query(Task).filter(Task.id == task_id).first()

            if task is None:
                return None

            task.completed = not task.completed
            db.commit()
            db.refresh(task)

            return task_to_type(task)
        finally:
            db.close()

    @strawberry.mutation
    def delete_task(self, task_id: int) -> bool:
        db: Session = SessionLocal()

        try:
            task = db.query(Task).filter(Task.id == task_id).first()

            if task is None:
                return False

            db.delete(task)
            db.commit()

            return True
        finally:
            db.close()


schema = strawberry.Schema(query=Query, mutation=Mutation)