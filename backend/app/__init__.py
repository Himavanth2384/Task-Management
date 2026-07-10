"""
Flask Application Factory.
Creates and configures the Flask application instance.
"""

from flask import Flask
from .config import get_config
from .extensions import db, migrate, jwt, cors


def create_app(config_class=None):
    """
    Application factory pattern.
    :param config_class: Optional config class override (used in tests).
    :return: Configured Flask application instance.
    """
    app = Flask(__name__)

    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.task_routes import task_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")

    # Create tables (for development/testing convenience)
    with app.app_context():
        db.create_all()

    # JWT error handlers
    _register_jwt_handlers(app)

    return app


def _register_jwt_handlers(app):
    """Register custom JWT error handlers for clean JSON responses."""
    from .utils.response import error_response

    @jwt.unauthorized_loader
    def unauthorized_callback(reason):
        return error_response("Missing or invalid authorization token", 401)

    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        return error_response("Invalid token", 401)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return error_response("Token has expired. Please log in again.", 401)

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_data):
        return error_response("Token has been revoked", 401)
