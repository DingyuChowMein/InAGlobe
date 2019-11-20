import os

from flask import abort, render_template
from .auth import token_auth, permission_required
from .models import User, USER_TYPE
from .tokens import generate_confirmation_token, confirm_token
from .emails import send_email
from datetime import datetime


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
