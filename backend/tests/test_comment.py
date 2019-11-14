import json
import pytest
import sys

sys.path.append('.')

from src.models import Comment, Project, User
from conftests import db, app, auth, client
from test_project import get_projects, upload_project, load_json_file
from flask import g

FILES = ['no_files.json', 'many_files.json', 'many_images_no_documents.json', 'many_documents_no_images.json']


def add_comment(client, auth, project_id, email='student@ic.ac.uk', comment_file='comment.json'):
    token = auth.get_token(email=email)
    json_comment = load_json_file(comment_file, 'test_files/comments')
    return client.post('/comments/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    }, json=json_comment)


def get_comments(client, auth, project_id, email='student@ic.ac.uk'):
    token = auth.get_token(email=email)
    return client.get('/comments/{}/'.format(project_id), headers={
        'Authorization': 'Bearer ' + token
    })


def load_projects(client, auth):
    [upload_project(client, auth, file=file) for file in FILES]


########################################################################################################################
# Create comment tests


@pytest.mark.parametrize('num_comments', range(5))
def test_create_comment(app, auth, client, num_comments):
    with app.app_context():
        load_projects(client, auth)
        ps = db.session.query(Project).all()

        for p in ps:
            rvs = [add_comment(client, auth, p.id) for i in range(num_comments)]
            assert all(rv.status_code == 201 for rv in rvs)
            assert all(b'text' in rv.data for rv in rvs)

            cs = db.session.query(Comment).filter(Comment.project_id == p.id).all()
            assert len(cs) == num_comments

        for p in ps:
            project_comments = db.session.query(Comment).filter(Comment.project_id == p.id).all()
            user_comments = db.session.query(Comment).filter(Comment.owner_id == g.current_user.id).all()
            assert project_comments is not [] and user_comments is not []
            assert set(project_comments) <= set(user_comments)


########################################################################################################################
# Get comment tests

def test_get_comment(app, auth, client):
    with app.app_context():
        load_projects(client, auth)
        p = db.session.query(Project).first()
        [add_comment(client, auth, p.id) for i in range(5)]

        rv = get_comments(client, auth, p.id)
        assert rv.status_code == 200
        assert b'comments' in rv.data

        cs = json.loads(rv.data.decode('utf-8')).get('comments')
        for c in cs:
            assert c['text'] == 'comment'
            assert c['ownerId'] == g.current_user.id
            assert c['ownerFirstName'] == g.current_user.first_name
            assert c['ownerLastName'] == g.current_user.last_name


########################################################################################################################
# Delete comment tests

def test_delete_comment():
    assert 0
