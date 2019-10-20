import unittest
import os
import json
import sys

sys.path.append('.')
from src import create_app, db
from src.models import Project, File


class ServerTestCase(unittest.TestCase):
    """This class represents the bucketlist test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        os.environ['APP_SETTINGS'] = 'config.TestingConfig'
        #os.environ['DATABASE_URL'] = 'mysql+pymsql://root:12345678@localhost'
        self.app = create_app()
        self.client = self.app.test_client
        self.project = {"Title": "hello", "ShortDescription": "nonce", "LongDescription": "Twat", "Location": "London", "ProjectOwner": "cunt", "FileLinks": []}

        # binds the app to the current context
        with self.app.app_context():
            # create all tables
            db.create_all()

    def test_project_creation(self):
        """Test API can create a project (POST request)"""
        res = self.client().post('/projects/', data=self.project)
        self.assertEqual(res.status_code, 201)
        #self.assertIn('Go to Borabora', str(res.data))

    def test_api_can_get_all_projects(self):
        """Test API can get a project (GET request)."""
        res = self.client().post('/projects/', data=self.project)
        self.assertEqual(res.status_code, 201)
        res = self.client().get('/projects/')
        self.assertEqual(res.status_code, 200)
        #self.assertIn('Go to Borabora', str(res.data))

    def test_api_can_get_project_by_id(self):
        """Test API can get a single bucketlist by using it's id."""
        rv = self.client().post('/projects/', data=self.project)
        self.assertEqual(rv.status_code, 201)
        result_in_json = json.loads(rv.data.decode('utf-8').replace("'", "\""))
        result = self.client().get(
            '/projects/{}'.format(result_in_json['id']))
        self.assertEqual(result.status_code, 200)
        #self.assertIn('Go to Borabora', str(result.data))

#     def test_project_can_be_edited(self):
#         """Test API can edit an existing project. (PUT request)"""
#         rv = self.client().post(
#             '/projects/',
#             data={'name': 'Eat, pray and love'})
#         self.assertEqual(rv.status_code, 201)
#         rv = self.client().put(
#             '/bucketlists/1',
#             data={
#                 "name": "Dont just eat, but also pray and love :-)"
#             })
#         self.assertEqual(rv.status_code, 200)
#         results = self.client().get('/bucketlists/1')
#         self.assertIn('Dont just eat', str(results.data))

#     def test_bucketlist_deletion(self):
#         """Test API can delete an existing bucketlist. (DELETE request)."""
#         rv = self.client().post(
#             '/bucketlists/',
#             data={'name': 'Eat, pray and love'})
#         self.assertEqual(rv.status_code, 201)
#         res = self.client().delete('/bucketlists/1')
#         self.assertEqual(res.status_code, 200)
#         # Test to see if it exists, should return a 404
#         result = self.client().get('/bucketlists/1')
#         self.assertEqual(result.status_code, 404)

    def tearDown(self):
        """teardown all initialized variables."""
        with self.app.app_context():
            # drop all tables
            db.session.remove()
            db.drop_all()


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
