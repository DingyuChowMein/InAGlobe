import os

from flask import g, abort, render_template
from . import db
from .auth import token_auth, permission_required
from .models import Project, File, User, Comment, Checkpoint, CheckpointFile, USER_TYPE, FILE_TYPE, PROJECT_STATUS, user_project_joining_table
from .tokens import generate_confirmation_token, confirm_token
from .emails import send_email
from collections import defaultdict
from sqlalchemy import or_, and_
from datetime import datetime

###############################################################################

@token_auth.login_required
def get_dashboard_projects():
    if g.current_user.get_permissions() == USER_TYPE['ADMIN']:
        return get_projects_helper(Project.query.filter(Project.status == PROJECT_STATUS['NEEDS_APPROVAL']).all())
    return get_projects_helper(g.current_user.projects)



@token_auth.login_required
def select_project(data):
    project = Project.query.filter(Project.id == data['projectId']).first()
    g.current_user.projects.append(project)
    db.session.commit()
    return {'message': 'Project selection requested!'}, 201


###############################################################################

@token_auth.login_required
def get_projects():
    user_id = g.current_user.get_id()
    user_type = g.current_user.get_permissions()
    join_relationship = []

    if user_type == USER_TYPE['ADMIN']:
        projects = Project.query.all()
    elif user_type == USER_TYPE['HUMANITARIAN']:
        projects = Project.query.filter(or_(
            Project.status == PROJECT_STATUS['APPROVED'],
            Project.project_owner == user_id
        )).all()
    else:
        projects = Project.query.filter(Project.status == PROJECT_STATUS['APPROVED']).all()
        join_relationship = db.session.query(user_project_joining_table) \
            .filter(user_project_joining_table.columns.user_id == user_id)

    return get_projects_helper(projects)


@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def upload_project(data):
    # TODO remove the code duplication for the try blocks
    try:
        if not data['title']:
            raise ValueError('title')
        if not data['shortDescription']:
            raise ValueError('short description')
        if not data['detailedDescription']:
            raise ValueError('detailed description')
        if not data['organisationName']:
            raise ValueError('organisation name')
        if not data['organisationLogo']:
            raise ValueError('organisation logo')

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

        # TODO exceptions for bad links
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
    except ValueError as e:
        return abort(400, 'Bad {} provided!'.format(e.__str__()))
    except Exception as e:
        return abort(400, '{} not valid!'.format(e.__str__()))
      
      
@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def delete_project(project_id):
    project = db.session.query(Project).filter(Project.id == project_id).first()
    if project is None:
        return {'message': 'Project does not exist!'}, 404
    if project in g.current_user.projects or g.current_user.is_admin():
        project.delete()
        return {'message': 'Project deleted!'}, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403


@token_auth.login_required
@permission_required(USER_TYPE['HUMANITARIAN'])
def update_project(data, project_id):
    p = db.session.query(Project).filter(Project.id == project_id).first()
    if p is None:
        return {'message': 'Project does not exist!'}, 404
    if p in g.current_user.projects or g.current_user.is_admin():
        if data.items == {}:
            return {'message': 'No changes!'}, 204

        project_fields = {
            'title': p.title,
            'shortDescription': p.short_description,
            'detailedDescription': p.long_description,
            'location': p.location,
            'organisationName': p.organisation_name,
            'organisationLogo': p.organisation_logo
        }

        for k, v in data.items():
            if k not in project_fields:
                return {'message': 'Bad request!'}, 400
            if v is not '':
                project_fields[k] = v

        db.session.commit()
        return {'message': 'Project updated!'}, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403


@token_auth.login_required
def upload_checkpoint(data, project_id):
    if not project_id:
        return {'message': "No project id"}

    checkpoint = Checkpoint(
        project_id=project_id,
        owner_id=g.current_user.get_id(),
        text=data['text'],
        title=data['title'],
        subtitle=data['subtitle'],
        owner_first_name=g.current_user.first_name,
        owner_last_name=g.current_user.last_name,
    )

    checkpoint.save()
    for c in data['documents']:
        checkpoint_file = CheckpointFile(
            checkpoint_id=checkpoint.id,
            link=c,
            type=FILE_TYPE['DOCUMENT']
        )

        checkpoint_file.save()

    for c in data['images']:
        checkpoint_file = CheckpointFile(
            checkpoint_id=checkpoint.id,
            link=c,
            type=FILE_TYPE['IMAGE']
        )

        checkpoint_file.save()

    return {'message': 'Checkpoint added!'}, 201


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

  
@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def approve_project_join(data):

    stm = user_project_joining_table.update().where(
            and_(
                user_project_joining_table.c.user_id == data['userId'],
                user_project_joining_table.c.project_id == data['projectId'])).\
            values({user_project_joining_table.c.approved: 1 - user_project_joining_table.c.approved})

    db.session.execute(stm)
    db.session.commit()

    return {"message": "Approved value flipped."}, 200


@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def get_joining_requests():
    requests = db.session.query(user_project_joining_table, User, Project) \
        .filter_by(approved=0)\
        .join(User, User.id == user_project_joining_table.c.user_id)\
        .join(Project, Project.id == user_project_joining_table.c.project_id)\
        .all()

    requests_json = [{
        "project_id": request.project_id,
        "user_id": request.user_id,
        "user_first_name": request.User.first_name,
        "user_last_name": request.User.last_name,
        "project_title": request.Project.title,
        "project_short_description": request.Project.short_description,
        "request_date_time": request.date_time
    } for request in requests]

    return {"requests": requests_json}, 200
 

@token_auth.login_required
@permission_required(USER_TYPE['ADMIN'])
def get_users():
    users = User.query.all()
    users_json = [{'Id': user.id, 'Email': user.email, 'UserType': user.user_type} for user in users]
    return {'users': users_json}, 200


def create_user(data):
    try:
        if not data['email']:
            raise ValueError('email')
        if not data['firstName']:
            raise ValueError('name')
        if not data['lastName']:
            raise ValueError('surname')
        if not data['userType'] in USER_TYPE:
            raise ValueError('user type')
        if not data['password'] or len(data['password']) < 8:
            raise ValueError('password')

        if data['userType'] == 'ADMIN':
            return {'message': 'Not allowed!'}, 403

        new_user = User(
            email=data['email'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            user_type=USER_TYPE[data['userType']]
        )

        new_user.hash_password(data['password'])
        new_user.save()
        
        token = generate_confirmation_token(new_user.email)
        confirm_url = os.environ['SITE_URL'] + f"login/confirm/{token}"
        html = render_template('confirm_email.html', confirm_url=confirm_url)
        subject = "Please confirm your email for Inaglobe"
        send_email(new_user.email, subject, html)
        
        return {'message': 'User created!'}, 201

    except ValueError as e:
        return abort(400, 'Bad {} provided!'.format(e.__str__()))
    except Exception as e:
        return abort(400, '{} not valid!'.format(e.__str__()))

  
def confirm_email(token):
    try:
        email = confirm_token(token)
    except:
        return {'message': 'The confirmation link is invalid or has expired'}, 404

    user = User.query.filter_by(email=email).first_or_404()
    if user.confirmed:
        return {'message': 'The confirmation link is invalid or has expired'}, 200
    else:
        user.confirmed = True
        user.confirmed_on = datetime.now()
        user.save()
    return {'message': 'You have confirmed your account!'}, 200

def confirm_reset_password_token(token):
    try:
        email = confirm_token(token)
        user = User.query.filter_by(email=email).first_or_404()
    except:
        return {'message': 'The reset password link is invalid or has expired'}, 404

def send_password_reset_email(data):
    email = data['email']
    token = generate_confirmation_token(email)
    confirm_url = os.environ['SITE_URL'] + f"login/resetpassword/{token}"
    html = render_template('reset_password.html', confirm_url=confirm_url)
    subject = "Please reset your password"
    send_email(email, subject, html)
    return {'message': 'Email sent!'}, 200

def reset_password(token, data):
    try:
        email = confirm_token(token)
    except:
        return {'message': 'The confirmation link is invalid or has expired'}, 404

    if not data['password'] or len(data['password']) < 8:
        raise ValueError('password')

    user = User.query.filter_by(email=email).first_or_404()
    user.hash_password(data['password'])
    user.save()

    return {'message': 'Your password has been reset!'}, 200


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
    g.current_user.comments.append(comment)
    db.session.commit()
    comment_json = {
        "commentId": comment.id,
        "text": comment.text,
        "ownerId": comment.owner_id,
        "ownerFirstName": comment.owner_first_name,
        "ownerLastName": comment.owner_last_name,
        "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    return {'message': 'Comment added!', 'comment': comment_json}, 201


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


@token_auth.login_required
def delete_comment(comment_id):
    comment = Comment.query.filter(Comment.id == comment_id).first()
    if comment is None:
        return {'message': 'Comment does not exist!'}, 404
    if comment in g.current_user.comments or g.current_user.is_admin():
        comment.delete()
        return {'message': 'Comment deleted!'}, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403

def get_projects_helper(projects):
    files = File.query.all()
    checkpoints = Checkpoint.query.all()
    checkpoint_files = CheckpointFile.query.all()
    join_relationship = []
    user_type = g.current_user.get_permissions()
    if user_type == USER_TYPE['STUDENT'] or user_type == USER_TYPE['ACADEMIC']:
        join_relationship = db.session.query(user_project_joining_table) \
            .filter(user_project_joining_table.columns.user_id == g.current_user.get_id())

    documents_map = defaultdict(list)
    images_map = defaultdict(list)
    checkpoints_map = defaultdict(list)
    checkpoint_documents_map = defaultdict(list)
    checkpoint_images_map = defaultdict(list)
    joined_projects = {}

    for f in files:
        if f.type == FILE_TYPE['DOCUMENT']:
            documents_map[f.project_id].append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            images_map[f.project_id].append(f.link)

    for f in checkpoint_files:
        if f.type == FILE_TYPE['DOCUMENT']:
            checkpoint_documents_map[f.checkpoint_id].append(f.link)
        elif f.type == FILE_TYPE['IMAGE']:
            checkpoint_images_map[f.checkpoint_id].append(f.link)

    for r in join_relationship:
        if r.approved == 1:
            joined_projects[r.project_id] = 2
        else:
            joined_projects[r.project_id] = 1

    for c in checkpoints:
        cJson = {
            "firstName": c.owner_first_name,
            "lastName": c.owner_last_name,
            "date": c.date_time,
            "title": c.title,
            "subtitle": c.subtitle,
            "text": c.text,
            "documents":checkpoint_documents_map[c.id],
            "images":checkpoint_images_map[c.id]
        }
        checkpoints_map[c.project_id].append(cJson)

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
        # 0 = not requested, 1 = needs approval, 2 = approved
        "joined": 0 if project.id not in joined_projects else joined_projects[project.id],
        "images": images_map[project.id],
        "checkpoints": checkpoints_map[project.id],
    } for project in projects]


    return {'projects': projects_json}, 200
