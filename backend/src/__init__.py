import os

from flask import Flask, request, make_response
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail

# initialise sql-alchemy
db = SQLAlchemy()
mail = Mail()


def new_response(json, status):
    response = make_response(json, status)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


def create_app():
    app = Flask(__name__)
    app.config.from_object(os.environ['APP_SETTINGS'])
    db.init_app(app)
    mail.init_app(app)
    api = Api(app)

    from .routes import (
        get_projects, upload_project, approve_project,
        upload_checkpoint,
        get_users, create_user, confirm_email, confirm_reset_password_token,
        reset_password, send_password_reset_email,
        add_comment, get_comments,
        get_dashboard_projects, select_project,
        get_joining_requests, approve_project_join,
        delete_project, delete_comment
    )
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

    class JoiningApproval(Resource, CORS):
        def get(self):
            response, code = get_joining_requests()
            return new_response(response, code)

        def post(self):
            response, code = approve_project_join(request.get_json())
            return new_response(response, code)

    class Dashboard(Resource, CORS):
        def get(self):
            response, code = get_dashboard_projects()
            return new_response(response, code)

        def post(self):
            response, code = select_project(request.get_json())
            return new_response(response, code)

    class Projects(Resource, CORS):
        def get(self):
            response, code = get_projects()
            return new_response(response, code)

        def post(self):
            response, code = upload_project(request.get_json())
            # print("IN POST \n \n")
            # print(request.get_json())
            return new_response(response, code)

        def delete(self, identifier):
            response, code = delete_project(identifier)
            return new_response(response, code)

        # def patch(self):
        #     response, code = approve_project(request.get_json())
        #     return new_response(response, code)

    class Comments(Resource):
        def options(self):
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response

        def get(self, identifier):
            response, code = get_comments(identifier)
            return new_response(response, code)

        def post(self, identifier):
            response, code = add_comment(request.get_json(), identifier)
            return new_response(response, code)

        def delete(self, identifier):
            response, code = delete_comment(identifier)
            return new_response(response, code)

    class Users(Resource, CORS):
        def get(self):
            response, code = get_users()
            return new_response(response, code)

        def post(self):
            response, code = create_user(request.get_json())
            return new_response(response, code)

    class Checkpoints(Resource):
        def options(self):
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response

        def post(self, identifier):
            response, code = upload_checkpoint(request.get_json(), identifier)
            return new_response(response, code)

    class Tokens(Resource, CORS):
        def get(self):
            response, code = get_token()
            return new_response(response, code)

        def delete(self):
            response, code = revoke_token()
            return new_response(response, code)
          
    class ConfirmEmail(Resource, CORS):
        def options(self, token):
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response
        
        def get(self, token):
            response, code = confirm_email(token)
            return new_response(response, code)

    class ResetPassword(Resource, CORS):
        def options(self, token=None):
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add('Access-Control-Allow-Headers', "*")
            response.headers.add('Access-Control-Allow-Methods', "*")
            return response
        
        def get(self, token):
            response, code = confirm_reset_password_token(token)
            return new_response(response, code)

        def post(self, token=None):
            if token:
                response, code = reset_password(token, request.get_json())
                return new_response(response, code)

            response, code = send_password_reset_email(request.get_json())
            return new_response(response, code)

    # Route classes to paths
    api.add_resource(Projects, '/projects/', '/projects/<int:identifier>/')
    api.add_resource(Comments, '/comments/', '/comments/<int:identifier>/')
    api.add_resource(Users, '/users/')
    api.add_resource(Tokens, '/users/tokens/')
    api.add_resource(Approvals, '/approve/')
    api.add_resource(JoiningApproval, '/joiningApprove/')
    api.add_resource(ConfirmEmail, '/confirm/', '/confirm/<token>/')
    api.add_resource(ResetPassword, '/resetpassword/', '/resetpassword/<token>/')
    api.add_resource(Dashboard, '/dashboard/')
    api.add_resource(Checkpoints, '/checkpoint/<int:identifier>/')

    return app
