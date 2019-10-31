from flask import g, request, abort
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from functools import wraps

from .models import User

basic_auth = HTTPBasicAuth()
# token_auth uses bearer tokens
token_auth = HTTPTokenAuth()

@basic_auth.verify_password
def verify_password(email, password):
    # email unique so there can only be one
    user = User.query.filter_by(email=email).first()
    if user is None:
        return False
    g.current_user = user
    return user.verify_password(password)


@basic_auth.error_handler
def basic_auth_error():
    return abort(404, 'User does not exist!')


@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None


@token_auth.error_handler
def token_error_handler():
    return abort(404, 'User does not exist!')


def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user = g.current_user
            if not user.has_permission(permission) or not user.is_admin():
                permissions_error_handler()
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def no_user_error():
    return abort(404, "User not found!")


def permissions_error_handler():
    return abort(403, "Insufficient permissions!")

# decorator
def requires_role(type):
    def decorator(func):
        @wraps(func)
        def decorated(*args, **kwargs):
            token = request.headers["Authorization"]
            print(token)
            user = User.query.filter_by(token=token).first()
            if user is None:
                return no_user_error()

            if user.user_type == type:
                return func(*args, **kwargs)
            else:
                return permissions_error_handler()
        return decorated
    return decorator

