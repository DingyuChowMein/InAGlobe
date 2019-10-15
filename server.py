import os
import sys
import logging
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI

app = Flask(__name__, static_folder='build/static', template_folder='build')
port = int(os.environ.get("PORT", 5000))

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/query_users")
def hello():
    print(len(users))
    return str(users)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=False, nullable=False)
    def __repr__(self):
        return "{} - {}".format(self.user_id, self.name)


db.session.add(User(name="Flask"))
db.session.commit()

users = db.session.query(User).all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
