from flask import g
from itsdangerous import URLSafeTimedSerializer

from . import db
from .auth import basic_auth, token_auth
import os


@basic_auth.login_required
def get_token():
    token = g.current_user.get_token()
    db.session.commit()
    return {
        'token': token,
        'firstname': g.current_user.first_name,
        'lastname': g.current_user.last_name,
        'permissions': g.current_user.get_permissions(),
        'userid': g.current_user.get_id()
    }, 200


@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return {'message': 'User removed!'}, 200


def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(os.environ['SECRET_KEY'])
    return serializer.dumps(email, salt=os.environ['SECURITY_PASSWORD_SALT'])

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(os.environ['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt=os.environ['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False

    return email
