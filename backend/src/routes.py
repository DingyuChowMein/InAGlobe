from .models import Project, File, User

# helper functions

def get_projects():
    projects = Project.query.all()
    projects_json = []
    for project in projects:
        project_files = File.query.filter_by(project_id=project.id).all()
        project_file_links = [file.link for file in project_files]
        project_fields_json = {
            "Title": project.title,
            "ShortDescription": project.short_description,
            "LongDescription": project.long_description,
            "Location": project.location,
            "ProjectOwner": project.project_owner,
            "FileLinks": project_file_links
        }
        projects_json.append(project_fields_json)
    return {'projects': projects_json}


def process_upload(data):
    # TODO: error handling (around saving to db)
    # TODO: check for duplication
    project = Project(
        title=data['Title'],
        short_description=data['ShortDescription'],
        long_description=data['LongDescription'],
        location=data['Location'],
        project_owner=data['ProjectOwner']
    )
    project.save()
    for link in data['FileLinks']:
        file = File(project_id=project.id, link=link)
        file.save()

    return {'message': 'Project added to db!'}

def get_users():
    users = User.query.all()
    users_json = []
    for user in users:
        # TODO: refactor this
        _u = {'Id': user.id, 'Email': user.email, 'PasswordHash': user.password_hash}
        users_json.append(_u)
    return {'users': users_json}


def create_user(data):
    new_user = User(
        email=data['Email']
    )
    new_user.hash_password(data['Password'])
    new_user.save()
    return {'message': 'User created!'}
