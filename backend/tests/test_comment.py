import pytest
import sys

sys.path.append('.')

from src.models import Comment
from conftests import db, app, auth, client
from test_project import get_projects, upload_project, load_json_file
from flask import g

FILES=['no_files.json', 'many_files.json', 'many_images_no_documents.json', 'many_documents_no_images.json']

def add_comment(client, auth, project_id, email='student@ic.ac.uk', comment_file='comment.json'):
    token = auth.get_token(email)
    json_comment = load_json_file(comment_file, 'test_files/comments')
    return client.post('/comments/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    }, json=json_comment)

def load_projects(client, auth):
    [upload_project(client, auth, file=file) for file in FILES]

########################################################################################################################
# Create comment tests

def test_create_comment(app, auth, client):
    with app.app_context():
        load_projects(client, auth)
        projects = db.session.query(Comment).all()

        for project in projects:
            rv = add_comment(client, auth, project.id)
            assert rv.status_code == 201
            assert b'comment' in rv.data
            c = db.session.query(Comment).filter(Comment.project_id == project.id).first()
            c_ = db.session.query(Comment).filter(Comment.owner_id == g.current_user.get_id()).first()
            assert c is not None and c_ is not None
            assert c == c_




########################################################################################################################
# Get comment tests

def test_get_comment():

    assert 0


########################################################################################################################
# Delete comment tests

def test_delete_comment():

    assert 0