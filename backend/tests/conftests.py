import os
import sys
import tempfile
import pytest
import sqlite3

from base64 import b64encode

sys.path.append('..')
from src import create_app, db


@pytest.fixture
def client():
    #create temporary testing database using sqlite
    db_fd, db_path = tempfile.mkstemp()
    sqlite3.connect(db_path)
    os.environ['DATABASE_URL'] = 'sqlite:///' + db_path

    #configure testing configuration
    os.environ['APP_SETTINGS'] = 'config.TestingConfig'

    #create app
    app = create_app()

    #create tables and yield client
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client


    # teardown db
    os.close(db_fd)
    os.unlink(db_path)

    # drop all tables
    with app.app_context():
        db.session.remove()
        db.drop_all()


def create_user(client, email, first_name, last_name, password, user_type):
    return client.post('/users/', json={
        'email': email,
        'firstName': first_name,
        'lastName': last_name,
        'userType': user_type,
        'password': password
    })


def login(client, email, password):
    kv = '{0}:{1}'.format(email, password)
    credentials = b64encode(kv.encode('utf-8')).decode('utf-8')
    return client.get('/users/tokens/', headers={
        'Authorization': 'Basic ' + credentials
    })

def test_create_signin(client):
    rv = create_user(client, 'email', 'name', 'surname', 'password', 'ADMIN')
    print(rv.data)
    print(rv.status_code)
    assert b'User created!' in rv.data
    assert 201 == rv.status_code
    ru = login(client, 'email', 'password')
    print(ru.data)
    print(ru.status_code)
    assert 200 == ru.status_code
    assert b'token' in ru.data
