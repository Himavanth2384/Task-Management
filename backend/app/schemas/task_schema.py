"""
Marshmallow schema for the Task model.
Handles serialization, deserialization, and validation of task data.
"""

from marshmallow import Schema, fields, validate, validates, ValidationError, pre_load, EXCLUDE
from ..models.task import TaskStatus, TaskPriority


VALID_STATUSES = [s.value for s in TaskStatus]
VALID_PRIORITIES = [p.value for p in TaskPriority]


class TaskCreateSchema(Schema):
    """Schema for validating task creation input."""
    
    class Meta:
        unknown = EXCLUDE

    title = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=255, error="Title must be between 1 and 255 characters."),
    )
    description = fields.Str(load_default=None)
    status = fields.Str(
        load_default=TaskStatus.PENDING.value,
        validate=validate.OneOf(VALID_STATUSES, error=f"Status must be one of: {', '.join(VALID_STATUSES)}."),
    )
    priority = fields.Str(
        load_default=TaskPriority.MEDIUM.value,
        validate=validate.OneOf(VALID_PRIORITIES, error=f"Priority must be one of: {', '.join(VALID_PRIORITIES)}."),
    )
    category = fields.Str(load_default=None, allow_none=True)
    due_date = fields.Date(load_default=None, allow_none=True, format="%Y-%m-%d")

    @pre_load
    def strip_strings(self, data, **kwargs):
        """Strip whitespace from string fields before validation."""
        for key in ("title", "description", "category"):
            if key in data and isinstance(data[key], str):
                data[key] = data[key].strip() or None
        return data


class TaskUpdateSchema(Schema):
    """Schema for validating task update input (all fields optional)."""

    class Meta:
        unknown = EXCLUDE

    title = fields.Str(
        validate=validate.Length(min=1, max=255, error="Title must be between 1 and 255 characters."),
    )
    description = fields.Str(allow_none=True)
    status = fields.Str(
        validate=validate.OneOf(VALID_STATUSES, error=f"Status must be one of: {', '.join(VALID_STATUSES)}."),
    )
    priority = fields.Str(
        validate=validate.OneOf(VALID_PRIORITIES, error=f"Priority must be one of: {', '.join(VALID_PRIORITIES)}."),
    )
    category = fields.Str(allow_none=True)
    due_date = fields.Date(allow_none=True, format="%Y-%m-%d")

    @pre_load
    def strip_strings(self, data, **kwargs):
        for key in ("title", "description", "category"):
            if key in data and isinstance(data[key], str):
                data[key] = data[key].strip() or None
        return data


class TaskOutputSchema(Schema):
    """Schema for serializing task data in API responses."""

    id = fields.Int(dump_only=True)
    title = fields.Str()
    description = fields.Str(allow_none=True)
    status = fields.Str()
    priority = fields.Str()
    category = fields.Str(allow_none=True)
    due_date = fields.Date(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    user_id = fields.Int(dump_only=True)


# Reusable schema instances
task_create_schema = TaskCreateSchema()
task_update_schema = TaskUpdateSchema()
task_output_schema = TaskOutputSchema()
tasks_output_schema = TaskOutputSchema(many=True)
