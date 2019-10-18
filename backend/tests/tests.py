import sys
sys.path.append('.')

from src import routes

import json
from os.path import join, dirname
from jsonschema import validate

def assert_valid_schema(data, schema_file):
    schema = _load_json_schema(schema_file)
    return validate(data, schema)

def _load_json_schema(filename):
    relative_path = join('schemas', filename)
    absolute_path = join(dirname(__file__), relative_path)

    with open(absolute_path) as schema_file:
        return json.loads(schema_file.read())

def test_get_projects_returns_good_json():
    projects = json.loads(routes.get_projects())
    for project_data in projects:
        assert_valid_schema(project_data, 'project.json')

def test_adding_projects_to_db():
    projects = json.loads(routes.get_projects())
    routes.upload_project() #add data
    projects_ = json.loads(routes.get_projects())
    assert len(projects_) == len(projects) + 1

########################################################################################################################

test_get_projects_returns_good_json()

#test_adding_projects_to_db()