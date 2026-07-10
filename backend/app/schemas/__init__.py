"""
Schemas package — expose all schemas for easy import.
"""

from .user_schema import (
    user_registration_schema,
    user_login_schema,
    user_output_schema,
)
from .task_schema import (
    task_create_schema,
    task_update_schema,
    task_output_schema,
    tasks_output_schema,
)

__all__ = [
    "user_registration_schema",
    "user_login_schema",
    "user_output_schema",
    "task_create_schema",
    "task_update_schema",
    "task_output_schema",
    "tasks_output_schema",
]
