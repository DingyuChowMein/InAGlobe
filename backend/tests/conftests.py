import os
import sys
import tempfile
import pytest
import sqlite3

from base64 import b64encode

sys.path.append('.')
from src import create_app, db


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

    #create tables and yield client
    with app.app_context():
        db.create_all()
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

    def create_user(self, email='email', first_name='name', last_name='surname', password='password', user_type='STUDENT'):
        return self.client.post('/users/', json={
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'userType': user_type,
            'password': password
        })

    def login(self, email='email', password='password'):
        kv = '{0}:{1}'.format(email, password)
        credentials = b64encode(kv.encode('utf-8')).decode('utf-8')
        return self.client.get('/users/tokens/', headers={
            'Authorization': 'Basic ' + credentials
        })

    def logout(self, token):
        return self.client.delete('/users/tokens/', headers={
            'Authorization': 'Bearer ' + token
        })


@pytest.fixture
def auth(client):
    return AuthActions(client)
