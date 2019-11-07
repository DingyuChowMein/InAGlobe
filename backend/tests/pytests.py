import pytest
import os
import tempfile

from ..src import create_app

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    os.environ['DATABASE_URL'] = db_path
    os.environ['APP_SETTINGS'] = 'config.TestingConfig'

    app = create_app()

    with app.test_client() as client:
        with app.app_context():
            app.init_db()
        yield client

    os.close(db_fd)
    os.unlink(db_path)