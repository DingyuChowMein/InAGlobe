import unittest
import os
import json
import sys

sys.path.append('.')
from src import create_app, db
from src.models import Project, File

from tests import _load_json_file


class ServerTestCase(unittest.TestCase):

    def setUp(self):
#         Define test variables and initialize app.
        self.app = create_app()
        self.client = self.app.test_client()

        self.project1 = _load_json_file('noFiles.json','upload_test_files')
        self.project2 = _load_json_file('oneFile.json','upload_test_files')
        self.project3 = _load_json_file('multipleFiles.json', 'upload_test_files')


#         binds the app to the current context
        with self.app.app_context():
#             create all tables
            db.create_all()

    def get(self):
        return self.client.get('/projects/')

    def post(self, project):
        return self.client.post('/projects/', data=json.dumps(project), content_type='application/json')

    def test_project_creation(self):
#         Test API can create a project (POST request)
        response = self.post(self.project1)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.project1, json.loads(response.data))

    def test_api_can_get_all_projects(self):
#         Post multiple projects
        self.post(self.project1)
        self.post(self.project2)

        response = self.get()
#         Check response code
        self.assertEqual(response.status_code, 200)
#         Check response data matches projects we posted
        self.assertIn(self.project1, json.loads(response.data))
        self.assertIn(self.project2, json.loads(response.data))

    def test_api_gets_all_projects_after_being_updated(self):
#         As above, we post two projects and check they are in the output
        self.post(self.project1)
        self.post(self.project2)

        response = self.get()
        self.assertEqual(response.status_code, 200)
        self.assertIn(self.project1, json.loads(response.data))
        self.assertIn(self.project2, json.loads(response.data))

#         project3 hasn't been added in yet, so it should not be in the HTTP response
        self.assertNotIn(self.project3, json.loads(response.data))

#         We now post project3 and check that it is now included in output
        self.post(self.project3)
        response = self.get()
        self.assertIn(self.project3, json.loads(response.data))


    def tearDown(self):
#         teardown all initialized variables between tests.
        with self.app.app_context():
            # drop all tables
            db.session.remove()
            db.drop_all()


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
