import os
import sys
import logging
import json
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey

from flask import request

app = Flask(__name__)
port = 5000
is_prod = os.environ.get('IS_HEROKU', None)

if is_prod:
    print("In production!")
    key = os.environ.get('INAGLOBE_DB', None)
else:
    print("In development!")
    from config import SQLALCHEMY_DATABASE_URI
    key = SQLALCHEMY_DATABASE_URI


app.config['SQLALCHEMY_DATABASE_URI'] = key
db = SQLAlchemy(app)

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)


class Project(db.Model):
    __tablename__ = 'Projects'
    __table_args__ = {'extend_existing': True}

    project_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Integer, nullable=False)
    short_description = db.Column(db.String, nullable=False)
    long_description = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    project_owner = db.Column(db.String, nullable=False)


class File(db.Model):
    __tablename__ = 'Files'
    __table_args__ = {'extend_existing': True}

    file_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey(Project.project_id))
    link = db.Column(db.String, nullable=False)


project_fields = ["title", "ShortDescription", "LongDescription", "Location", "ProjectOwner"]


# UploadProject?Title=””&ShortDescription=””LongDescription=””&Location=””&ProjectOwner=””FileLinks=””
@app.route("/UploadProject")
def upload_project():
    def parse_file_links(file_links):
        # state = 0 means parsing link length
        # state = 1 means parsing link text
        state = 0
        link_length = 0
        link_text = []
        parsed_links = []
        pos = 0
        while pos < len(file_links):
            if state == 0:
                link_length = link_length * 10 + (ord(file_links[pos]) - ord('0'))
                pos = pos + 1
                if file_links[pos].isalpha():
                    state = 1
            elif state == 1:
                for i in range(link_length):
                    link_text.append(file_links[pos + i])
                parsed_links.append(''.join(link_text))
                link_text = []
                state = 0
                pos = pos + link_length
                link_length = 0
        return parsed_links

    for parameter in project_fields:
        if request.args.get(parameter) is None:
            return "<div>failure: the parameter named \"{}\" was not provided</div>".format(parameter)
        if not request.args[parameter].strip():
            return "<div>failure: the parameter named \"{}\" is empty</div>".format(parameter)

    new_project = Project(
        title=request.args[project_fields[0]],
        short_description=request.args[project_fields[1]],
        long_description=request.args[project_fields[2]],
        location=request.args[project_fields[3]],
        project_owner=request.args[project_fields[4]]
    )
    db.session.add(new_project)

    try:
        db.session.commit()
    except Exception as e:
        return "<div>failure: {}</div>".format(str(e))

    file_links = request.args.get("FileLinks")
    if file_links is not None:
        links = parse_file_links(file_links)
        for currLink in links:
            db.session.add(File(project_id=new_project.project_id, link=currLink))

    try:
        db.session.commit()
    except Exception as e:
        return "<div>failure: {}</div>".format(str(e))
    return "<div>success: added project with id {}</div>".format(new_project.project_id)


@app.route("/GetProjects")
def get_projects():
    projects = db.session.query(Project).all()
    projects_json = []
    for project in projects:
        project_files = db.session.query(File).filter_by(project_id=project.project_id)
        project_files_json = []
        for file in project_files:
            project_files_json.append({"FileId": file.file_id, "Link": file.link})
        project_fields_json = {"Title": project.title, "ShortDescription": project.short_description,
                               "LongDescription": project.long_description, "Location": project.location,
                               "ProjectOwner": project.project_owner, "Files": project_files_json}
        projects_json.append(project_fields_json)
    return json.dumps(projects_json)


if __name__ == '__main__':
    app.run(host="localhost", port=port)
