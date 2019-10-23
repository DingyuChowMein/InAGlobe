from src import db
from sqlalchemy import ForeignKey

# TODO: update field length values
TITLE_FIELD_LENGTH = 16
SHORT_FIELD_LENGTH = 16
LONG_FIELD_LENGTH = 32
LOCATION_FIELD_LENGTH = 16
OWNER_FIELD_LENGTH = 16
LINK_FIELD_LENGTH = 32

class Project(db.Model):
    __tablename__ = 'Projects'
    __table_args__ = {'extend_existing': True}


    project_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(TITLE_FIELD_LENGTH), nullable=False)
    short_description = db.Column(db.String(SHORT_FIELD_LENGTH), nullable=False)
    long_description = db.Column(db.String(LONG_FIELD_LENGTH), nullable=False)
    location = db.Column(db.String(LOCATION_FIELD_LENGTH), nullable=False)
    project_owner = db.Column(db.String(OWNER_FIELD_LENGTH), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod

    def get_all():
        return Project.query.all()

    def filter(data):
        return Project.query.filter(data).all()

    def delete(self):
        db.session.remove(self)
        db.session.commit()

    def __repr__(self):
        return '<project id {}>'.format(self.project_id)


class File(db.Model):
    __tablename__ = 'Files'
    __table_args__ = {'extend_existing': True}

    file_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey(Project.project_id))
    link = db.Column(db.String(LINK_FIELD_LENGTH), nullable=False)

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod

    def get_all():
        return File.query.all()

    #filter by foreign key
    def filter(data):
        return File.query.filter_by(project_id=data).all()

    def delete(self):
        db.session.remove(self)
        db.session.commit()

    def __repr__(self):
        return '<file id {}>'.format(self.file_id)
