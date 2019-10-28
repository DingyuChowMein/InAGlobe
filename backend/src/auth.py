from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth

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


# TODO create error handler
@basic_auth.error_handler
def basic_auth_error():
    return '', 204


@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None


@token_auth.error_handler
def token_error_handler():
    return '', 204
