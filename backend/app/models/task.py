"""
Task model — represents a task owned by a user.
Includes enums for status, priority, and optional category.
"""

import enum
from datetime import datetime, timezone
from ..extensions import db


class TaskStatus(str, enum.Enum):
    """Valid task status values."""
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"


class TaskPriority(str, enum.Enum):
    """Valid task priority levels."""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Task(db.Model):
    """SQLAlchemy model for user tasks."""

    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20),
        nullable=False,
        default=TaskStatus.PENDING.value,
    )
    priority = db.Column(
        db.String(10),
        nullable=False,
        default=TaskPriority.MEDIUM.value,
    )
    category = db.Column(db.String(100), nullable=True)
    due_date = db.Column(db.Date, nullable=True)

    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Foreign key — links task to its owning user
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    def to_dict(self) -> dict:
        """Serialize task to a plain dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "category": self.category,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "user_id": self.user_id,
        }

    def __repr__(self) -> str:
        return f"<Task id={self.id} title={self.title!r} status={self.status!r}>"
