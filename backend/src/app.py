from flask import Flask
from config import Config
#from flask_migrate import Migrate
#from flask_script import Manager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
#migrate = Migrate(app, db)
#manager = Manager(app)

from src import routes, models