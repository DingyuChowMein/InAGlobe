import os

from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy

# initialise sql-alchemy
db = SQLAlchemy()

def new_response(json, status):
    response = make_response(json, status)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def create_app():
    app = Flask(__name__)
    app.config.from_object(os.environ['APP_SETTINGS'])
    db.init_app(app)
    api = Api(app)

    from .routes import get_projects, process_upload, get_users, create_user, add_comment, get_comments, approve_project
    from .tokens import get_token, revoke_token

    # Override pre-flight request to fix CORS issue
    class CORS(object):
        def options(self):
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response

    # Define api
    class Approvals(Resource, CORS):
        def post(self):
            response, code = approve_project(request.get_json())
            return new_response(response, code)

    class Projects(Resource, CORS):
        def get(self):
            response, code = get_projects()
            return new_response(response, code)

        def post(self):
            response, code = process_upload(request.get_json())
            # print("IN POST \n \n")
            # print(request.get_json())
            return new_response(response, code)

        def patch(self):
            response, code = approve_project(request.get_json())
            return new_response(response, code)

    class Comments(Resource):
        def options(self, project_id):
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response
        
        def get(self, project_id):
            response, code = get_comments(project_id)
            return new_response(response, code)

        def post(self, project_id):
            response, code = add_comment(request.get_json(), project_id)
            return new_response(response, code)

    class Users(Resource, CORS):
        def get(self):
            response, code = get_users()
            return new_response(response, code)

        def post(self):
            response, code = create_user(request.get_json())
            return new_response(response, code)

    class Tokens(Resource, CORS):
        def get(self):
            response, code = get_token()
            return new_response(response, code)

        def delete(self):
            response, code = revoke_token()
            return new_response(response, code)


    # Route classes to paths
    api.add_resource(Projects, '/projects/')
    api.add_resource(Comments, '/comments/', '/comments/<int:project_id>')
    api.add_resource(Users, '/users/')
    api.add_resource(Tokens, '/users/tokens/')
    api.add_resource(Approvals, '/approve/')

    return app
