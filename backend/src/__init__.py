from flask import Flask, request
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource

#initialise sql-alchemy
db = SQLAlchemy()

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    api = Api(app)

    from src import routes

    # Define api
    class Projects(Resource):
        def get(self):
            return routes.get_projects(), 200

        def post(self):
            data = request.get_json()
            return routes.process_upload(data), 201

    # Route classes to paths
    api.add_resource(Projects, '/projects/')

    return app
