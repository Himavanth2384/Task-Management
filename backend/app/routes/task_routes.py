"""
Task routes — Full CRUD + Filter/Sort/Pagination + Dashboard stats.

All endpoints are JWT-protected. Users can only access their own tasks.

Endpoints:
  GET    /api/tasks              — List tasks (with filters, sort, pagination)
  GET    /api/tasks/stats        — Dashboard statistics
  GET    /api/tasks/<id>         — Get a single task
  POST   /api/tasks              — Create a new task
  PUT    /api/tasks/<id>         — Update a task
  DELETE /api/tasks/<id>         — Delete a task
"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from ..services.task_service import TaskService
from ..utils.response import success_response, error_response

task_bp = Blueprint("tasks", __name__)


def _current_user_id() -> int:
    """Helper to get the current authenticated user's ID as int."""
    return int(get_jwt_identity())


@task_bp.route("", methods=["GET"])
@jwt_required()
def get_tasks():
    """
    List all tasks for the authenticated user with optional filtering.

    Query Params:
        status, priority, category, search,
        sort_by (created_at|due_date), order (asc|desc),
        page, limit

    Returns:
        200: { success, message, data: { tasks, pagination } }
    """
    try:
        filters = {
            "status": request.args.get("status"),
            "priority": request.args.get("priority"),
            "category": request.args.get("category"),
            "search": request.args.get("search"),
            "sort_by": request.args.get("sort_by", "created_at"),
            "order": request.args.get("order", "desc"),
            "page": request.args.get("page", 1),
            "limit": request.args.get("limit", 10),
        }
        result = TaskService.get_tasks(_current_user_id(), filters)
        return success_response("Tasks retrieved successfully.", result)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@task_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    """
    Get dashboard statistics for the authenticated user.

    Returns:
        200: { success, message, data: { total, pending, in_progress, completed, high_priority } }
    """
    try:
        stats = TaskService.get_dashboard_stats(_current_user_id())
        return success_response("Statistics retrieved successfully.", stats)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@task_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required()
def get_task(task_id: int):
    """
    Get a single task by ID.

    Returns:
        200: { success, message, data: { task } }
        403: If user doesn't own the task.
        404: If task not found.
    """
    try:
        task = TaskService.get_task(task_id, _current_user_id())
        return success_response("Task retrieved successfully.", {"task": task})
    except LookupError as e:
        return error_response(str(e), 404)
    except PermissionError as e:
        return error_response(str(e), 403)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@task_bp.route("", methods=["POST"])
@jwt_required()
def create_task():
    """
    Create a new task.

    Request Body:
        { title, description?, status?, priority?, category?, due_date? }

    Returns:
        201: { success, message, data: { task } }
        400: Validation errors.
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be valid JSON.", 400)

    try:
        task = TaskService.create_task(_current_user_id(), data)
        return success_response("Task created successfully.", {"task": task}, 201)
    except ValidationError as e:
        return error_response("Validation failed.", 400, e.messages)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@task_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required()
def update_task(task_id: int):
    """
    Update an existing task (partial updates supported).

    Returns:
        200: { success, message, data: { task } }
        400: Validation errors.
        403: Ownership violation.
        404: Task not found.
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be valid JSON.", 400)

    try:
        task = TaskService.update_task(task_id, _current_user_id(), data)
        return success_response("Task updated successfully.", {"task": task})
    except ValidationError as e:
        return error_response("Validation failed.", 400, e.messages)
    except LookupError as e:
        return error_response(str(e), 404)
    except PermissionError as e:
        return error_response(str(e), 403)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)


@task_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required()
def delete_task(task_id: int):
    """
    Delete a task.

    Returns:
        200: { success, message }
        403: Ownership violation.
        404: Task not found.
    """
    try:
        TaskService.delete_task(task_id, _current_user_id())
        return success_response("Task deleted successfully.")
    except LookupError as e:
        return error_response(str(e), 404)
    except PermissionError as e:
        return error_response(str(e), 403)
    except Exception as e:
        return error_response("An unexpected error occurred.", 500)
