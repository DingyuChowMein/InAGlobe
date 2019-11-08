import pytest
import sys

sys.path.append('.')
import json
from os.path import join, dirname

from src.models import Project
from conftests import db, app, auth, client
from flask import g

class PermissionHandler(object):
    def __init__(self, auth):
        self.auth = auth

    def set(self, permission):
        self.auth.create_user(user_type=permission)
        rv = self.auth.login('email', 'password')
        return json.loads(rv.data.decode('utf-8')).get('token')


@pytest.fixture
def permission(auth):
    return PermissionHandler(auth)

def get_projects(client, token):
    return client.get('/projects/', headers={
        'Authorization': 'Bearer ' + token
    })

def upload_project(client, token, json):
    return client.post('/projects/', headers={
        'Authorization': 'Bearer ' + token
    }, json=json)

def load_json_file(filename, dir):
    relative_path = join(dir, filename)
    absolute_path = join(dirname(__file__), relative_path)

    with open(absolute_path) as json_file:
        return json.loads(json_file.read())

########################################################################################################################
# Get projects tests

@pytest.mark.parametrize(('user_type', 'message', 'code'), (
        ('STUDENT', b'projects', 200),
))
def test_get_project(client, permission, user_type, message, code):
    token = permission.set(user_type)
    rv = get_projects(client, token)
    assert code == rv.status_code
    assert message in rv.data



########################################################################################################################
# Upload project tests

@pytest.mark.parametrize(('file', 'message', 'code'), (
        ('no_files.json', b'Project added to db!', 201),
        ('one_document_no_images.json', b'Project added to db!', 201),
        ('one_image_no_documents.json', b'Project added to db!', 201),
        ('many_documents_no_images.json', b'Project added to db!', 201),
        ('many_images_no_documents.json', b'Project added to db!', 201),
        ('many_files.json', b'Project added to db!', 201),
))
def test_project_upload(app, client, permission, file, message, code):
    with app.app_context():
        # We check that there are no projects in an empty database
        assert (
                db.session.query(Project).first()
                is None
        )
        # Create and load a humanitarian user
        token = permission.set('HUMANITARIAN')
        json_file = load_json_file(file, 'project_test_files')
        rv = upload_project(client, token, json_file)
        # After uploading one file we check that there is only one project in the database
        assert db.session.query(Project).count() == 1
        # And we make sure that this project belongs to our humanitarian user
        assert(
            db.session.query(Project).filter(Project.project_owner == g.current_user.get_id()).first()
            is not None
        )
    # Finally check that HTTP response is appropriate
    assert code == rv.status_code
    assert message in rv.data
    


