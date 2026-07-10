"""
Task service — business logic for task CRUD, filtering, sorting, and pagination.
Ownership is enforced here so routes stay thin.
"""

from datetime import datetime, timezone
from marshmallow import ValidationError

from ..extensions import db
from ..models.task import Task, TaskStatus, TaskPriority
from ..schemas.task_schema import (
    task_create_schema,
    task_update_schema,
    task_output_schema,
    tasks_output_schema,
)


class TaskService:
    """Handles all task-related operations with ownership enforcement."""

    @staticmethod
    def get_tasks(user_id: int, filters: dict) -> dict:
        """
        Retrieve a paginated, filtered, and sorted list of tasks for a user.

        Supported filter keys:
          - status, priority, category, search
          - sort_by (due_date | created_at), order (asc | desc)
          - page, limit

        :param user_id: Authenticated user's ID.
        :param filters: Dict of query parameters.
        :return: Dict with tasks list and pagination metadata.
        """
        query = Task.query.filter_by(user_id=user_id)

        # --- Filters ---
        if status := filters.get("status"):
            query = query.filter(Task.status == status)

        if priority := filters.get("priority"):
            query = query.filter(Task.priority == priority)

        if category := filters.get("category"):
            query = query.filter(Task.category.ilike(f"%{category}%"))

        if search := filters.get("search"):
            search_term = f"%{search}%"
            query = query.filter(
                db.or_(
                    Task.title.ilike(search_term),
                    Task.description.ilike(search_term),
                )
            )

        # --- Sorting ---
        sort_by = filters.get("sort_by", "created_at")
        order = filters.get("order", "desc")

        sort_column = Task.due_date if sort_by == "due_date" else Task.created_at
        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # --- Pagination ---
        try:
            page = max(1, int(filters.get("page", 1)))
            limit = min(100, max(1, int(filters.get("limit", 10))))
        except (ValueError, TypeError):
            page, limit = 1, 10

        paginated = query.paginate(page=page, per_page=limit, error_out=False)

        return {
            "tasks": tasks_output_schema.dump(paginated.items),
            "pagination": {
                "page": page,
                "limit": limit,
                "total": paginated.total,
                "pages": paginated.pages,
                "has_next": paginated.has_next,
                "has_prev": paginated.has_prev,
            },
        }

    @staticmethod
    def get_task(task_id: int, user_id: int) -> dict:
        """
        Retrieve a single task, verifying ownership.

        :param task_id: ID of the task.
        :param user_id: Authenticated user's ID.
        :return: Serialized task dict.
        :raises LookupError: If task not found.
        :raises PermissionError: If user doesn't own the task.
        """
        task = db.session.get(Task, task_id)
        if not task:
            raise LookupError("Task not found.")
        if task.user_id != user_id:
            raise PermissionError("You do not have permission to access this task.")
        return task_output_schema.dump(task)

    @staticmethod
    def create_task(user_id: int, data: dict) -> dict:
        """
        Create a new task for the authenticated user.

        :param user_id: Authenticated user's ID.
        :param data: Raw request JSON.
        :return: Serialized newly created task.
        :raises ValidationError: If input is invalid.
        """
        validated = task_create_schema.load(data)

        task = Task(user_id=user_id, **validated)
        db.session.add(task)
        db.session.commit()

        return task_output_schema.dump(task)

    @staticmethod
    def update_task(task_id: int, user_id: int, data: dict) -> dict:
        """
        Update an existing task, verifying ownership.

        :param task_id: ID of the task to update.
        :param user_id: Authenticated user's ID.
        :param data: Partial or full update data.
        :return: Serialized updated task.
        :raises LookupError: If task not found.
        :raises PermissionError: If user doesn't own the task.
        :raises ValidationError: If input is invalid.
        """
        task = db.session.get(Task, task_id)
        if not task:
            raise LookupError("Task not found.")
        if task.user_id != user_id:
            raise PermissionError("You do not have permission to modify this task.")

        validated = task_update_schema.load(data, partial=True)

        # Apply only the fields that were provided
        for field, value in validated.items():
            setattr(task, field, value)

        # Manually update the timestamp
        task.updated_at = datetime.now(timezone.utc)
        db.session.commit()

        return task_output_schema.dump(task)

    @staticmethod
    def delete_task(task_id: int, user_id: int) -> None:
        """
        Delete a task, verifying ownership.

        :param task_id: ID of the task to delete.
        :param user_id: Authenticated user's ID.
        :raises LookupError: If task not found.
        :raises PermissionError: If user doesn't own the task.
        """
        task = db.session.get(Task, task_id)
        if not task:
            raise LookupError("Task not found.")
        if task.user_id != user_id:
            raise PermissionError("You do not have permission to delete this task.")

        db.session.delete(task)
        db.session.commit()

    @staticmethod
    def get_dashboard_stats(user_id: int) -> dict:
        """
        Compute dashboard statistics for the authenticated user.

        :param user_id: Authenticated user's ID.
        :return: Dict of task counts by status/priority.
        """
        base_query = Task.query.filter_by(user_id=user_id)

        return {
            "total": base_query.count(),
            "pending": base_query.filter_by(status=TaskStatus.PENDING.value).count(),
            "in_progress": base_query.filter_by(status=TaskStatus.IN_PROGRESS.value).count(),
            "completed": base_query.filter_by(status=TaskStatus.COMPLETED.value).count(),
            "high_priority": base_query.filter_by(priority=TaskPriority.HIGH.value).count(),
        }
