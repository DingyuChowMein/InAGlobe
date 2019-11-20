import logging
import os

from flask import Flask, request, make_response, Response
from flask_cors import CORS, cross_origin
from flask_mail import Mail
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from redis import Redis, StrictRedis

# initialise sql-alchemy
db = SQLAlchemy()
red = StrictRedis()
mail = Mail()


# def new_response(json, status):
#     response = make_response(json, status)
#     response.headers.add("Access-Control-Allow-Origin", "*")
#     return response


def create_app():
    app = Flask(__name__)
    app.config.from_object(os.environ['APP_SETTINGS'])
    db.init_app(app)
    mail.init_app(app)
    api = Api(app)
    CORS(app)
    app.redis = Redis.from_url(app.config['REDIS_URL'])

    from .routes import (
        get_projects, upload_project, approve_project,
        upload_checkpoint,
        get_users, create_user, confirm_email, confirm_reset_password_token,
        reset_password, send_password_reset_email,
        get_dashboard_projects, select_project,
        get_joining_requests, approve_project_join,
        delete_project, update_project
    )
    from .comments import add_comment, get_comments, delete_comment, comment_stream
    from .tokens import get_token, revoke_token

    # # Override pre-flight request to fix CORS issue
    # class CORS(object):
    #     def options(self, *args):
    #         response = make_response()
    #         response.headers.add("Access-Control-Allow-Origin", "*")
    #         response.headers.add('Access-Control-Allow-Headers', "*")
    #         response.headers.add('Access-Control-Allow-Methods', "*")
    #         return response

    # Define api
    class Approvals(Resource):
        def post(self):
            response, code = approve_project(request.get_json())
            return make_response(response, code)

    class JoiningApproval(Resource):
        def get(self):
            response, code = get_joining_requests()
            return make_response(response, code)

        def post(self):
            response, code = approve_project_join(request.get_json())
            return make_response(response, code)

    class Dashboard(Resource):
        @cross_origin()
        def get(self):
            response, code = get_dashboard_projects()
            return make_response(response, code)

        def post(self):
            response, code = select_project(request.get_json())
            return make_response(response, code)

    class Projects(Resource):
        @cross_origin()
        def get(self):
            response, code = get_projects()
            return make_response(response, code)

        def post(self):
            response, code = upload_project(request.get_json())
            return make_response(response, code)

        def delete(self, identifier):
            response, code = delete_project(identifier)
            return make_response(response, code)

        def patch(self, identifier):
            response, code = update_project(request.get_json(), identifier)
            return make_response(response, code)

    class Comments(Resource):
        @cross_origin()
        def get(self, identifier):
            response, code = get_comments(identifier)
            app.logger.info('comment get')
            return make_response(response, code)

        def post(self, identifier):
            response, code = add_comment(request.get_json(), identifier)
            app.logger.info('comment post')
            app.logger.info('publish to channel comment{}'.format(identifier))
            return make_response(response, code)

        def delete(self, identifier):
            response, code = delete_comment(identifier)
            app.logger.info('comment deleted')
            return make_response(response, code)

    class CommentStream(Resource):

        def __init__(self):
            # This works if a different commentStream instance is generated for each unique identifier
            self.runstream = True

        @cross_origin()
        def get(self, identifier):
            app.logger.info('comment stream MARK')
            return Response(comment_stream(app, identifier, self.runstream), mimetype='text/event-stream')

        def delete(self):
            self.runstream = False

    class Users(Resource):
        def get(self):
            response, code = get_users()
            return make_response(response, code)

        def post(self):
            response, code = create_user(request.get_json())
            return make_response(response, code)

    class Checkpoints(Resource):
        def post(self, identifier):
            response, code = upload_checkpoint(request.get_json(), identifier)
            return make_response(response, code)

    class Tokens(Resource):
        def get(self):
            response, code = get_token()
            return make_response(response, code)

        def delete(self):
            response, code = revoke_token()
            return make_response(response, code)

    class ConfirmEmail(Resource):
        def get(self, token):
            response, code = confirm_email(token)
            return make_response(response, code)

    class ResetPassword(Resource):
        def get(self, token):
            response, code = confirm_reset_password_token(token)
            return make_response(response, code)

        def post(self, token=None):
            if token:
                response, code = reset_password(token, request.get_json())
                return make_response(response, code)

            response, code = send_password_reset_email(request.get_json())
            return make_response(response, code)

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
    api.add_resource(CommentStream, '/comment-stream/<int:identifier>')

    return app
