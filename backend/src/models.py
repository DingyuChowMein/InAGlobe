import base64
import os
from datetime import datetime, timedelta

from sqlalchemy import ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash

from . import db


class Model:
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def delete(self):
        db.session.remove(self)
        db.session.commit()

    def __repr__(self):
        return '<id {}>'.format(self.id)


class Project(Model, db.Model):
    __tablename__ = 'Projects'

    title = db.Column(db.String(32), nullable=False)
    short_description = db.Column(db.String(100), nullable=False)
    long_description = db.Column(db.String(256), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    project_owner = db.Column(db.String(32), nullable=False)


class File(Model, db.Model):
    __tablename__ = 'Files'

    project_id = db.Column(db.Integer, ForeignKey(Project.id))
    link = db.Column(db.String(64), nullable=False)


# class USER_TYPE(Enum):
#     ADMIN = 0,
#     HUMANITARIAN = 1,
#     ACADEMIC = 2,
#     STUDENT = 3

USER_TYPE = {
    'ADMIN': 0,
    'HUMANITARIAN': 1,
    'ACADEMIC': 2,
    'STUDENT': 3
}

class User(Model, db.Model):
    __tablename__ = 'Users'

    email = db.Column(db.String(32), unique=True)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)
    user_type = db.Column(db.Integer, default=USER_TYPE['STUDENT'])

    def hash_password(self, password):
        self.password_hash = generate_password_hash(password, method='sha256')

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_token(self, expires_in=3600):
        now = datetime.utcnow()

        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token

        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.add(self)
        return self.token

    def revoke_token(self):
        self.token_expiration = datetime.utcnow() - timedelta(seconds=1)

    def set_permissions(self, t):
        if not t is None:
            self.user_type = USER_TYPE[t]

    def has_permission(self, permission):
        return self.user_type == permission

    def get_permissions(self):
        return self.user_type

    def is_admin(self):
        return self.user_type == USER_TYPE['ADMIN']

    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user


class Comment(Model, db.Model):
    __tablename__ = 'Comments'

    project_id = db.Column(db.Integer, ForeignKey(Project.id))
    owner_id = db.Column(db.Integer, nullable=False)
    date_time = db.Column(db.DateTime, default=datetime.now())
    text = db.Column(db.String(100), nullable=False)

    @staticmethod
    def get_all_comments_for_project_id(proj_id):
        return File.query.filter_by(project_id=proj_id).all()
