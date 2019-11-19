from flask import g
from . import db, red
from .auth import token_auth
from .models import Comment
from json import dumps


@token_auth.login_required
def add_comment(data, project_id):
    comment = Comment(
        project_id=project_id,
        owner_id=g.current_user.get_id(),
        text=data['text'],
        owner_first_name=g.current_user.first_name,
        owner_last_name=g.current_user.last_name
    )
    comment.save()
    comment_json = {
        "commentId": comment.id,
        "text": comment.text,
        "ownerId": comment.owner_id,
        "ownerFirstName": comment.owner_first_name,
        "ownerLastName": comment.owner_last_name,
        "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
    }
    response = {'message': 'Comment added!', 'comment': comment_json}
    red.publish('comment{}'.format(project_id), '{}'.format(dumps(response)))
    g.current_user.comments.append(comment)
    db.session.commit()
    return response, 201


@token_auth.login_required
def get_comments(project_id):
    if not project_id:
        return {'message': "No project id"}
    project_comments = Comment.query.filter_by(project_id=project_id).all()
    comments_json = [{
        "commentId": comment.id,
        "text": comment.text,
        "ownerId": comment.owner_id,
        "ownerFirstName": comment.owner_first_name,
        "ownerLastName": comment.owner_last_name,
        "date": comment.date_time.strftime("%Y-%m-%d %H:%M:%S")
    } for comment in project_comments]
    return {"comments": comments_json}, 200


@token_auth.login_required
def delete_comment(comment_id):
    comment = Comment.query.filter(Comment.id == comment_id).first()
    if comment is None:
        return {'message': 'Comment does not exist!'}, 404
    if comment in g.current_user.comments or g.current_user.is_admin():
        comment.delete()
        return {'message': 'Comment deleted!'}, 200
    else:
        return {'message': 'Insufficient permissions!'}, 403


def comment_stream(app, project_id):
    pubsub = red.pubsub()
    pubsub.subscribe('comment{}'.format(project_id))
    app.logger.info('subscribed to comment{}'.format(project_id))
    while True:
        for message in pubsub.listen():
            byte_data = message.get('data')
            try:
                string_data = byte_data.decode('utf-8')
                app.logger.info(string_data)
                yield 'event: commentstream\ndata: {}\n\n'.format(string_data)
            except (UnicodeDecodeError, AttributeError):
                pass
