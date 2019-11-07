import sys
sys.path.append('.')
import json

from conftests import client, create_user, login, logout


########################################################################################################################
# User creation tests

def test_create_user(client):
    rv = create_user(client, 'email', 'name', 'surname', 'password', 'ADMIN')
    assert 201 == rv.status_code
    assert b'User created!' in rv.data


########################################################################################################################
# User login tests

def test_login(client):
    create_user(client, 'email', 'name', 'surname', 'password', 'ADMIN')
    rv = login(client, 'email', 'password')
    assert 200 == rv.status_code
    assert b'token' in rv.data


########################################################################################################################
# User signout tests

def test_logout(client):
    create_user(client, 'email', 'name', 'surname', 'password', 'ADMIN')
    # get user token from login
    rv = login(client, 'email', 'password')
    token = json.loads(rv.data.decode('utf-8')).get('token')
    #test logout
    rv_ = logout(client, token)
    assert 200 == rv_.status_code
    assert b'User removed!' in rv_.data