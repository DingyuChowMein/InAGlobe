import os
import sys
import tempfile
import pytest
import sqlite3

from base64 import b64encode
import json

sys.path.append('.')
from src import create_app, db
from src.models import User
from src.tokens import generate_confirmation_token


@pytest.fixture
def app():
    #create temporary testing database using sqlite
    db_fd, db_path = tempfile.mkstemp()
    sqlite3.connect(db_path)
    os.environ['DATABASE_URL'] = 'sqlite:///' + db_path

    #configure testing configuration
    os.environ['APP_SETTINGS'] = 'config.TestingConfig'

    #create app
    app = create_app()

    # Yield the client after setup.
    with app.app_context():
        # Create database tables
        db.create_all()

        # Create dummy users
        admin = User(email='admin@administrator.co', first_name='Drosophilia', last_name='Melongangster', user_type='0', confirmed=True)
        admin.hash_password('password')

        humanitarian = User(email='humanitarian@charity.org', first_name='Mike', last_name='Hunt', user_type='1', confirmed=True)
        humanitarian.hash_password('password')

        academic = User(email='academic@academia.com', first_name='Tess', last_name='Tickle', user_type='2', confirmed=True)
        academic.hash_password('password')

        student = User(email='student@ic.ac.uk', first_name='Helmut', last_name='Schmacker', user_type='3', confirmed=True)
        student.hash_password('password')

        # Put users in database
        admin.save()
        humanitarian.save()
        academic.save()
        student.save()

    yield app


    # teardown db
    os.close(db_fd)
    os.unlink(db_path)

    # drop all tables
    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


class AuthActions(object):
    def __init__(self, client):
        self.client = client

    def create_user(self, email='email@ic.ac.uk', first_name='name', last_name='surname', password='password', user_type='STUDENT'):
        return self.client.post('/users/', json={
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'userType': user_type,
            'password': password
        })

    def confirm_user(self, email='email@ic.ac.uk'):
        token = generate_confirmation_token(email)
        return self.client.get('/confirm/{}/'.format(token))

    def login(self, email='student@ic.ac.uk', password='password'):
        kv = '{0}:{1}'.format(email, password)
        credentials = b64encode(kv.encode('utf-8')).decode('utf-8')
        return self.client.get('/users/tokens/', headers={
            'Authorization': 'Basic ' + credentials
        })

    def get_token(self, email='student@ic.ac.uk', password='password'):
        rv = self.login(email=email, password=password)
        return json.loads(rv.data.decode('utf-8')).get('token')

    def logout(self, token):
        return self.client.delete('/users/tokens/', headers={
            'Authorization': 'Bearer ' + token
        })


@pytest.fixture
def auth(client):
    return AuthActions(client)

