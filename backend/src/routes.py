from .auth import token_auth
from .models import Project, File, User, Comment
from collections import defaultdict


# helper functions

@token_auth.login_required
def get_projects():
    projects = Project.query.all()
    files = File.query.all()

    projects_json = []

    fileMap = defaultdict(list)
    for f in files:
        fileMap[f.project_id].append(f.link)
    
    for project in projects:
        documents = fileMap[project.id]
        project_fields_json = {
            "id": project.id,
            "title": project.title,
            "shortDescription": project.short_description,
            "detailedDescription": project.long_description,
            "location": project.location,
            "projectOwner": project.project_owner,
            "documents": documents,
            "organisation": "",
            "organisationLogo": "",
            "status": "",
            "images": [],
        }

        projects_json.append(project_fields_json)

    return {'projects': projects_json}


@token_auth.login_required
def process_upload(data):
    # TODO: error handling (around saving to db)
    print(data)
    project = Project(
        title=data['title'],
        short_description=data['shortDescription'],
        long_description=data['detailedDescription'],
        location=data['location'],
        project_owner=data['projectOwner']
    )
    print(project.title)
    print(project.project_owner)
    project.save()
    print("SAVED")
    if data.get("documents") is not None:
        for link in data['documents']:
            file = File(project_id=project.id, link=link)
            file.save()

    return {'message': 'Project added to db!'}


@token_auth.login_required
def get_users():
    # TODO: only admins should be able to see the list of users
    users = User.query.all()
    users_json = []
    for user in users:
        # TODO: refactor this
        _u = {'Id': user.id, 'Email': user.email, 'PasswordHash': user.password_hash}
        users_json.append(_u)
    return {'users': users_json}


def create_user(data):
    new_user = User(
        email=data['email'],
        password_hash=data['password'],
        first_name=data['firstName'],
        last_name=data['lastName']
    )
    new_user.hash_password(data['password'])
    new_user.save()
    return {'message': 'User created!'}


@token_auth.login_required
def add_comment(data):
    comment = Comment(
        project_id=data['ProjectId'],
        owner_id=data['OwnerId'],
        text=data['Text']
    )

    comment.save()
    return {'message': 'Comment added!'}


@token_auth.login_required
def get_comments(data):
    project_comments = Comment.query.filter_by(project_id=data['ProjectId']).all()
    comments_json = []
    for comment in project_comments:
        comments_json.append({
            "CommentId": comment.id,
            "Text": comment.text,
            "OwnerId": comment.owner_id,
            "Date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
        })
    return {"Comments": comments_json}
