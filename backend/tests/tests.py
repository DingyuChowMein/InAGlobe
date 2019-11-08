# import sys
#
# sys.path.append('.')
#
# from src import routes
#
# import json
# from os.path import join, dirname
# from jsonschema import validate
#
#
# ########################################################################################################################
#
# # Helper functions
#
# def assert_valid_schema(data, schema_file):
#     schema = _load_json_file(schema_file, 'schemas')
#     return validate(data, schema)
#
#
# def _load_json_file(filename, dir):
#     relative_path = join(dir, filename)
#     absolute_path = join(dirname(__file__), relative_path)
#
#     with open(absolute_path) as json_file:
#         return json.loads(json_file.read())
#
#
# def assert_json_equal(a, b):
#     return json.dumps(a) == json.dumps(b)
#
#
# ########################################################################################################################
#
# def test_get_projects_returns_good_json():
#     projects = json.loads(routes.get_projects())
#     for project_data in projects:
#         assert_valid_schema(project_data, 'project.json')
#
#
# def test_adding_projects_to_db():
#     projects = json.loads(routes.get_projects())
#     add_project_to_db_no_files()
#     projects_ = json.loads(routes.get_projects())
#     assert len(projects_) == len(projects) + 1
#     assert_json_equal(projects_[len(projects_) - 1], _load_json_file('no_files.json', 'project_test_files'))
#
#
# ########################################################################################################################
#
# # Test UploadProject
#
# # Test upload functions work and produce correct errors with provided json data.
#
# def test_upload(file):
#     data = _load_json_file(file, 'project_test_files')
#     # assert routes.process_upload(data) == 201
#     print('Upload test passed.')
#
#
# def test_upload_no_files():
#     print('Testing good upload with no files attached')
#     return test_upload('no_files.json')
#
#
# def test_upload_one_file():
#     print('Testing good upload with one file attached')
#     return test_upload('one_document_no_images.json')
#
#
# def test_upload_multiple_files():
#     print('Testing good upload with multiple files attached')
#     return test_upload('many_files.json')
#
#
# #
#
# # TODO: upload tests for bad json files
#
# # Test upload projects url calls:
#
# def get_upload_projects_http_response(data):
#     # response = requests.post(
#     #     'localhost:5000/UploadProject',
#     #     data=data,
#     #     content_type='application/json'
#     # )
#     #
#     # print(response.get_data(as_text=True))
#     return 0
#
# # get_upload_projects_http_response(_load_json_file('no_files.json', 'project_test_files'))
#
# ########################################################################################################################
#
# # test_get_projects_returns_good_json()
#
# # test_adding_projects_to_db()
