from flask import g

from . import db
from .auth import basic_auth, token_auth


@basic_auth.login_required
def get_token():
    token = g.current_user.get_token()
    db.session.commit()
    return {'token': token}


@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return '', 204
