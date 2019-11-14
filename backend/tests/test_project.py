import pytest
import sys

sys.path.append('.')
import json
from os.path import join, dirname

from src.models import Project, File, FILE_TYPE
from conftests import db, app, auth, client
from flask import g


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
# Upload project tests

@pytest.mark.parametrize(('file', 'number_of_documents', 'number_of_images', 'message', 'code'), (
        ('no_files.json', 0, 0, b'Project added to db!', 201),
        ('one_document_no_images.json', 1, 0,  b'Project added to db!', 201),
        ('one_image_no_documents.json', 0, 1, b'Project added to db!', 201),
        ('many_documents_no_images.json', 3, 0, b'Project added to db!', 201),
        ('many_images_no_documents.json', 0, 3, b'Project added to db!', 201),
        ('many_files.json', 3, 3, b'Project added to db!', 201),
))
def test_project_upload(app, client, auth, file, number_of_documents, number_of_images, message, code):
    with app.app_context():
        # We check that there are no projects in an empty database
        assert (
                db.session.query(Project).first()
                is None
        )
        # And that there are no file links either
        assert (
            db.session.query(File).first()
            is None
        )
        # Load a humanitarian user
        token = auth.get_token(email='humanitarian@charity.org')
        json_file = load_json_file(file, 'project_test_files')
        rv = upload_project(client, token, json_file)

        p_query = db.session.query(Project)
        # After uploading one file we check that there is only one project in the database
        assert p_query.count() == 1
        # And we make sure that this project belongs to our humanitarian user
        assert(
            p_query.filter(Project.project_owner == g.current_user.get_id()).first()
            is not None
        )

        f_query = db.session.query(File)
        # If documents have been attached to this project...
        if number_of_documents > 0:
            # We make sure they have all been properly assigned
            files = f_query.filter(File.type == FILE_TYPE['DOCUMENT']).all()
            assert len(files) == number_of_documents
            for file in files:
                assert file is not None
                assert file.project_id == p_query.first().id
        # Do the same for images that are attached
        if number_of_images > 0:
            files = f_query.filter(File.type == FILE_TYPE['IMAGE']).all()
            assert len(files) == number_of_images
            for file in files:
                assert file is not None
                assert file.project_id == p_query.first().id

        # Finally check that HTTP response is appropriate
        assert code == rv.status_code
        assert message in rv.data


# TODO: create more 'bad' test files, test cases here such as the commented out one (including bad filelinks), and add error handling
@pytest.mark.parametrize(('file', 'email', 'message', 'code'), (
        ('no_files.json', 'student@ic.ac.uk', b'Insufficient permissions!', 403),
        ('missing_title.json', 'student@ic.ac.uk', b'Insufficient permissions!', 403),
        ('missing_title.json', 'humanitarian@charity.org', b'Bad title provided!', 400),
))
def test_bad_project_upload(app, client, auth, file, email, message, code):
    with app.app_context():
        token = auth.get_token(email=email)
        json_file = load_json_file(file, 'project_test_files')
        rv = upload_project(client, token, json_file)
        # Check that no projects have been uploaded
        assert not db.session.query(Project).all()
        assert code == rv.status_code
        assert message in rv.data


########################################################################################################################
# Get projects tests

# TODO: add more test cases for the get project api
@pytest.mark.parametrize(('files', 'email', 'expected', 'code'), (
        (['no_files.json'], 'admin@administrator.co', [b'no files'], 200),
        (['no_files.json', 'many_files.json'], 'admin@administrator.co', [b'many documents many images', b'no files'], 200),
        (['no_files.json', 'many_files.json'], 'student@ic.ac.uk', [], 200),
))
def test_get_project(client, auth, files, email, expected, code):
    # Load up database with projects
    token = auth.get_token(email='humanitarian@charity.org')
    for file in files:
        json_file = load_json_file(file, 'project_test_files')
        upload_project(client, token, json_file)

    token = auth.get_token(email=email)
    rv = get_projects(client, token)
    assert code == rv.status_code

    # Check that the response data has exactly the number of project files we expected on return
    response_projects = json.loads(rv.data.decode('utf-8')).get('projects')
    assert len(expected) == len(response_projects)
    # and that these projects match the input
    for message in expected:
        assert message in rv.data

# TODO: create tests for project approval and dashboard
