import base64
import os
from datetime import datetime, timedelta

from sqlalchemy import ForeignKey, DateTime
from werkzeug.security import generate_password_hash, check_password_hash

from . import db

# TODO: update field length values
TITLE_FIELD_LENGTH = 16
SHORT_FIELD_LENGTH = 16
LONG_FIELD_LENGTH = 32
LOCATION_FIELD_LENGTH = 16
OWNER_FIELD_LENGTH = 16
LINK_FIELD_LENGTH = 32


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

    title = db.Column(db.String(TITLE_FIELD_LENGTH), nullable=False)
    short_description = db.Column(db.String(SHORT_FIELD_LENGTH), nullable=False)
    long_description = db.Column(db.String(LONG_FIELD_LENGTH), nullable=False)
    location = db.Column(db.String(LOCATION_FIELD_LENGTH), nullable=False)
    project_owner = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)


class File(Model, db.Model):
    __tablename__ = 'Files'

    project_id = db.Column(db.Integer, ForeignKey(Project.id))
    link = db.Column(db.String(LINK_FIELD_LENGTH), nullable=False)


class User(Model, db.Model):
    __tablename__ = 'Users'

    email = db.Column(db.String(32), unique=True)
    password_hash = db.Column(db.String(256), nullable=False)
    token = db.Column(db.String(32), index=True, unique=True)
    token_expiration = db.Column(db.DateTime)

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

    @staticmethod
    def check_token(token):
        user = User.query.filter_by(token=token).first()
        if user is None or user.token_expiration < datetime.utcnow():
            return None
        return user


class Comment(db.Model):
    __tablename__ = 'Comments'
    __table_args__ = {'extend_existing': True}

    comment_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey(Project.id))
    owner_id = db.Column(db.Integer, nullable=False)
    date_time = db.Column(DateTime, default=datetime.now())
    text = db.Column(db.String, nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all_comments_for_project_id(proj_id):
        return File.query.filter_by(project_id=proj_id).all()

    def delete(self):
        db.session.remove(self)
        db.session.commit()

