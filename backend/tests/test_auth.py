import pytest
import sys
sys.path.append('.')

from conftests import client, create_user, login

def test_create_user(client):
    rv = create_user(client, 'email', 'name', 'surname', 'password', 'ADMIN')
    assert b'User created!' in rv.data
    assert 201 == rv.status_code
    ru = login(client, 'email', 'password')
    print(ru.data)
    print(ru.status_code)
    assert 200 == ru.status_code
    assert b'token' in ru.data

def test_login(client):
    create_user(client, 'email', 'name', 'surname', 'password', 'ADMIN')

    rv = login(client, 'email', 'password')
    assert 200 == rv.status_code
    assert b'token' in rv.data
