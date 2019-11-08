import pytest
import sys

sys.path.append('.')
import json

from src.models import User
from conftests import db, app, auth, client


########################################################################################################################
# User creation tests

@pytest.mark.parametrize(('user_type'), (
        ('ADMIN'),
        ('HUMANITARIAN'),
        ('ACADEMIC'),
        ('STUDENT'),
))
def test_create_user(app, auth, user_type):
    with app.app_context():
        # Check that a user which has not been registered is not in the database
        assert (
                db.session.query(User).filter(User.email == 'email').first()
                is None
        )
        # We now register the user
        rv = auth.create_user(user_type=user_type)
        assert 201 == rv.status_code
        assert b'User created!' in rv.data
        # Check the user has been registered in the database
        assert (
                db.session.query(User).filter(User.email == 'email').first()
                is not None
        )

# TODO: error handling for bad user registration
@pytest.mark.parametrize(('email', 'password', 'first_name', 'last_name', 'user_type', 'message', 'code'), (
        # ('', 'password', 'name', 'surname', 'STUDENT', b'No email provided!', 400),
        # ('email', '', 'name', 'surname', 'STUDENT', b'No password provided!', 400),
        # ('email', 'password', '', 'surname', 'STUDENT', b'No name provided!', 400),
        # ('email', 'password', 'name', '', 'STUDENT', b'No surname provided!', 400),
        # ('email', 'password', 'name', 'surname', '', b'User type not specified!', 400),
))
def test_bad_create_user(auth, email, password, first_name, last_name, user_type, message, code):
    rv = auth.create_user(email, first_name, last_name, password, user_type)
    assert code == rv.status_code
    assert message in rv.data


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


# TODO: error handling for incorrect passwords
@pytest.mark.parametrize(('email', 'password', 'message', 'code'), (
        # ('email', 'wrongpassword', b'Incorrect password!', 401),
        ('wrong_email', 'password', b'User does not exist!', 404),
))
def test_bad_login(auth, email, password, message, code):
    auth.create_user()
    rv = auth.login(email, password)
    assert rv.status_code == code
    assert message in rv.data


########################################################################################################################
# User signout tests

def test_logout(app, auth):
    with app.app_context():
        auth.create_user()
        # Get user token from login
        rv = auth.login('email', 'password')
        token = json.loads(rv.data.decode('utf-8')).get('token')
        # Test logout
        rv_ = auth.logout(token)
        assert 200 == rv_.status_code
        assert b'User removed!' in rv_.data
        # Check that the token has expired
        assert User.check_token(token) is None

# TODO: add more 'bad' logout tests