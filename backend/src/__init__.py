import os

from flask import Flask, request
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
import json

# initialise sql-alchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(os.environ['APP_SETTINGS'])
    db.init_app(app)
    api = Api(app)

    from .routes import get_projects, process_upload, get_users, create_user, add_comment, get_comments
    from .tokens import get_token

    # Define api
    class Projects(Resource):
        def get(self):
            return get_projects(), 200

        def post(self):
            return process_upload(request.get_json()), 201

    class Comments(Resource):
        def get(self):
            return get_comments(request.get_json()), 200

        def post(self):
            return add_comment(request.get_json()), 201

    class Users(Resource):
        def get(self):
            return get_users(), 200

        def post(self):
            return create_user(request.get_json()), 201

    class Tokens(Resource):
        def get(self):
            return get_token(), 200

    # Route classes to paths
    api.add_resource(Projects, '/projects/')
    api.add_resource(Comments, '/comments/')
    api.add_resource(Users, '/users/')
    api.add_resource(Tokens, '/users/tokens/')

    return app
