from src import create_app, db

app = create_app()

from src.models import Project, File, User


# run flask shell
@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Project': Project, 'File': File, 'User' : User}


if __name__ == "__main__":
    app.run()
