import os
import sys
import logging
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey

from config import SQLALCHEMY_DATABASE_URI
from flask import request

app = Flask(__name__, static_folder='build/static', template_folder='build')
port = int(os.environ.get("PORT", 5000))

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)


@app.route("/")
def index():
    return render_template('index.html')


# UploadProject?Title=””&ShortDescription=””LongDescription=””&Location=””&ProjectOwner=””FileLinks=””
@app.route("/UploadProject")
def upload_project():
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

    def parse_file_links(fileLinks):
        return [fileLinks]

    parameters = ["title", "ShortDescription", "LongDescription", "Location", "ProjectOwner"]
    for parameter in parameters:
        if request.args.get(parameter) is None:
            return "<div>failure: the parameter named \"{}\" was not provided</div>".format(parameter)
        if not request.args[parameter].strip():
            return "<div>failure: the parameter named \"{}\" is empty</div>".format(parameter)

    new_project = Project(
        title=request.args[parameters[0]],
        short_description=request.args[parameters[1]],
        long_description=request.args[parameters[2]],
        location=request.args[parameters[3]],
        project_owner=request.args[parameters[4]]
    )
    db.session.add(new_project)

    try:
        db.session.commit()
    except Exception as e:
        return "<div>failure: {}</div>".format(str(e))

    fileLinks = request.args.get("FileLinks")
    if fileLinks is not None:
        links = parse_file_links(fileLinks)
        for currLink in links:
            db.session.add(File(project_id=new_project.project_id, link=currLink))

    try:
        db.session.commit()
    except Exception as e:
        return "<div>failure: {}</div>".format(str(e))
    return "<div>success: added project with id {}</div>".format(new_project.project_id)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
