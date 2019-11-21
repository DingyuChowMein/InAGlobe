import os

from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from redis import Redis, StrictRedis

# initialise sql-alchemy
db = SQLAlchemy()
redis_client = StrictRedis()
mail = Mail()


def create_app():
    app = Flask(__name__)
    app.config.from_object(os.environ['APP_SETTINGS'])
    db.init_app(app)
    mail.init_app(app)
    api = Api(app)
    CORS(app)
    app.redis = Redis.from_url(app.config['REDIS_URL'])

    from .routes import (
        Projects, ProjectStream,  Approvals, JoiningApproval, Dashboard, Checkpoints,
        Comments, CommentStream,
        User, Users, Tokens, ConfirmEmail, ResetPassword
    )

    # Route classes to paths
    api.add_resource(Projects, '/projects/', '/projects/<int:identifier>/')
    api.add_resource(Comments, '/comments/', '/comments/<int:identifier>/')
    api.add_resource(User, '/user/<int:identifier>/')
    api.add_resource(Users, '/users/')
    api.add_resource(Tokens, '/users/tokens/')
    api.add_resource(Approvals, '/approve/')
    api.add_resource(JoiningApproval, '/joiningApprove/')
    api.add_resource(ConfirmEmail, '/confirm/', '/confirm/<token>/')
    api.add_resource(ResetPassword, '/resetpassword/', '/resetpassword/<token>/')
    api.add_resource(Dashboard, '/dashboard/')
    api.add_resource(Checkpoints, '/checkpoint/<int:identifier>/')
    api.add_resource(CommentStream, '/comment-stream/<int:identifier>')
    api.add_resource(ProjectStream, '/project-stream/')

    return app
