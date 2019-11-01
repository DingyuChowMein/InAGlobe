from flask import g
from . import db
from .auth import token_auth, permission_required
from .models import Project, File, User, Comment, USER_TYPE, FILE_TYPE, PROJECT_STATUS
from collections import defaultdict
from sqlalchemy import or_


########################################################################################################################

@token_auth.login_required
def get_dashboard_projects():
    # print(user_id.projects)
    # projects = user_.query.with_parent(User.id == user_id.get_id()).all()
    # projects = Project.query.join(user_id.projects)
    # print(projects)
    # projects = [Project.query.filter(Project.id == project_id).first() for project_id in user_id.projects]
    # projects = []
    # for project_id in user_id.projects:
    #     print(project_id)
    #     p = Project.query.filter(Project.id == project_id).first()
    #     print(p)
    #     projects.append(p)
    # project_ids = UserProjects.db.query.filter(UserProjects.id == user_id).all()
    # projects = []
    # for project_id in project_ids:
    #     project = Project.query.filter(Project.id == project_id).first()
    #     projects.append(project)

    # projects = Project.query.filter(Project.id.in_(user_id.projects)).all()

    # projects = Project.query.has(Project.id.in_(user_id.projects)).all()
    # projects = User.query.filter_by(id=user_id.id).first().projects
    #     # print(projects)
    return get_projects_helper(g.current_user.projects)


@token_auth.login_required
@permission_required(USER_TYPE['STUDENT'])
def select_project(data):
    project = Project.query.filter(Project.id == data['projectId']).first()

    g.current_user.projects.append(project)
    # project.users.append(g.current_user)

    db.session.commit()
    return {'message': 'Project selected!'}, 201

########################################################################################################################

@token_auth.login_required
def get_projects():
    user_id = g.current_user.get_id()
    user_type = g.current_user.get_permissions()

    if user_type == USER_TYPE['ADMIN']:
        projects = Project.query.all()
    elif user_type == USER_TYPE['HUMANITARIAN']:
        projects = Project.query.filter(or_(
            Project.status == PROJECT_STATUS['APPROVED'],
            Project.project_owner == user_id
        )).all()
    else:
        projects = Project.query.filter(Project.status == PROJECT_STATUS['APPROVED']).all()

    return get_projects_helper(projects)


@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def upload_project(data):
    # TODO: error handling (around saving to db)
    project = Project(
        title=data['title'],
        short_description=data['shortDescription'],
        long_description=data['detailedDescription'],
        location=data['location'],
        project_owner=g.current_user.get_id(),
        organisation_name=data['organisationName'],
        organisation_logo=data['organisationLogo']
    )
    project.save()
    if data.get("documents") is not None:
        for link in data['documents']:
            file = File(project_id=project.id, link=link, type=FILE_TYPE['DOCUMENT'])
            file.save()
        for link in data['images']:
            file = File(project_id=project.id, link=link, type=FILE_TYPE['IMAGE'])
            file.save()

    #Create dashboard link for humanitarians
    g.current_user.projects.append(project)
    db.session.commit()

    return {'message': 'Project added to db!'}, 201


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def approve_project(data):
    project = Project.query.filter_by(id=data['projectId']).first()
    if project.status == PROJECT_STATUS['APPROVED']:
        project.status = PROJECT_STATUS['NEEDS_APPROVAL']
        message = "Project disapproved"
    else:
        project.status = PROJECT_STATUS['APPROVED']
        message = "Project approved"
    project.save()

    return {"message": message}, 200

########################################################################################################################

@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def get_users():
    users = User.query.all()
    users_json = [{'Id': user.id, 'Email': user.email, 'UserType': user.user_type} for user in users]
    return {'users': users_json}, 200


def create_user(data):
    new_user = User(
        email=data['email'],
        first_name=data['firstName'],
        last_name=data['lastName'],
        user_type=USER_TYPE[data['userType']]
    )
    new_user.hash_password(data['password'])
    new_user.save()
    return {'message': 'User created!'}, 201

########################################################################################################################

@token_auth.login_required
def add_comment(data, project_id):
    comment = Comment(
        project_id=project_id,
        owner_id=g.current_user.get_id(),
        text=data['text'],
        owner_first_name=g.current_user.first_name,
        owner_last_name=g.current_user.last_name
    )
    comment.save()
    return {'message': 'Comment added!'}, 201


@token_auth.login_required
def get_comments(project_id):
    if not project_id:
        return {'message': "No project id"}
    project_comments = Comment.query.filter_by(project_id=project_id).all()
    comments_json = [{
        "commentId": comment.id,
        "text": comment.text,
        "ownerId": comment.owner_id,
        "ownerFirstName": comment.owner_first_name,
        "ownerLastName": comment.owner_last_name,
        "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
    } for comment in project_comments]
    return {"comments": comments_json}, 200

########################################################################################################################

def get_projects_helper(projects):
    files = File.query.all()


    documents_map = defaultdict(list)
    images_map = defaultdict(list)
    for f in files:
        if f.type == FILE_TYPE['DOCUMENT']:
            documents_map[f.project_id].append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            images_map[f.project_id].append(f.link)

    projects_json = [{
        "id": project.id,
        "title": project.title,
        "shortDescription": project.short_description,
        "detailedDescription": project.long_description,
        "location": project.location,
        "projectOwner": project.project_owner,
        "documents": documents_map[project.id],
        "organisationName": project.organisation_name,
        "organisationLogo": project.organisation_logo,
        "status": project.status,
        "images": images_map[project.id],
    }for project in projects]

    return {'projects': projects_json}, 200