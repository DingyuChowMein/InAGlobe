from flask import g

from . import db
from .auth import basic_auth, token_auth


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
    return {'message': 'user removed'}, 200
