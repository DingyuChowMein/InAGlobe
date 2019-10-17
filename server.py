import os
import sys
import logging
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
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

    db.session.add(Project(
        title=request.args["title"],
        short_description=request.args["ShortDescription"],
        long_description=request.args["LongDescription"],
        location=request.args["Location"],
        project_owner=request.args["ProjectOwner"]
    ))

    try:
        db.session.commit()
    except Exception as e:
        return "<div>failure: {}</div>".format(str(e))
    return "<div>success</div>"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
