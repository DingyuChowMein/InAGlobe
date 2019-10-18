from src.app import db
from sqlalchemy import ForeignKey


class Project(db.Model):
    __tablename__ = 'Projects'
    __table_args__ = {'extend_existing': True}

    project_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Integer, nullable=False)
    short_description = db.Column(db.String, nullable=False)
    long_description = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    project_owner = db.Column(db.String, nullable=False)

    def __repr__(self):
        return '<project title {}>'.format(self.title)


project_fields = ["title", "ShortDescription", "LongDescription", "Location", "ProjectOwner"]


class File(db.Model):
    __tablename__ = 'Files'
    __table_args__ = {'extend_existing': True}

    file_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey(Project.project_id))
    link = db.Column(db.String, nullable=False)

    def __repr__(self):
        return '<file id {}>'.format(self.file_id)