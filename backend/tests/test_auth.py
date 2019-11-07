import sys
sys.path.append('.')
import json

from src.models import User
from conftests import db, app, auth, client


########################################################################################################################
# User creation tests

def test_create_user(app, auth):
    with app.app_context():
        # Check that a user which has not been registered is not in the database
        assert (
                db.session.query(User).filter(User.email == 'email').first()
                is None
        )
    # We now register the user
    rv = auth.create_user()
    assert 201 == rv.status_code
    assert b'User created!' in rv.data
    with app.app_context():
        # Check the user has been registered in the database
        assert (
                db.session.query(User).filter(User.email == 'email').first()
                is not None
        )


########################################################################################################################
# User login tests

def test_login(app, auth):
    auth.create_user()
    with app.app_context():
        # A token is only generated after the user logs in, so it should not exist at this stage
        assert (
            db.session.query(User).filter(User.email == 'email').first().token
            is None
        )
    rv = auth.login('email', 'password')
    with app.app_context():
        # The token should now exist
        assert (
            db.session.query(User).filter(User.email == 'email').first().token
            is not None
        )
    assert 200 == rv.status_code
    assert b'token' in rv.data

def test_login_multiple_users(auth):
    auth.create_user(email='email1', first_name='one')
    auth.create_user(email='email2', first_name='two')
    auth.create_user(email='email3', first_name='three')

    rv = auth.login('email1', 'password')
    assert b'one' in rv.data
    assert b'two' not in rv.data
    assert b'three' not in rv.data

    rv = auth.login('email2', 'password')
    assert b'two' in rv.data
    assert b'one' not in rv.data
    assert b'three' not in rv.data

    rv = auth.login('email3', 'password')
    assert b'three' in rv.data
    assert b'one' not in rv.data
    assert b'two' not in rv.data

def test_login_invalid_password(auth):
    auth.create_user()
    rv = auth.login('email', 'wrong password')
    assert rv.status_code == 401
    assert b'Incorrect password!' in rv.data

def test_login_unregistered_user(auth):
    rv = auth.login('email', 'password')
    assert rv.status_code == 404
    assert b'User does not exist!' in rv.data


########################################################################################################################
# User signout tests

def test_logout(app, auth):
    auth.create_user()
    # Get user token from login
    rv = auth.login('email', 'password')
    token = json.loads(rv.data.decode('utf-8')).get('token')
    # Test logout
    rv_ = auth.logout(token)
    assert 200 == rv_.status_code
    assert b'User removed!' in rv_.data
    with app.app_context():
        # Check that the token has expired
        assert User.check_token(token) is None

