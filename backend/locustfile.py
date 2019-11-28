from base64 import b64encode
from json import loads
from locust import HttpLocust, TaskSet, task, between
from os import environ


class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def on_stop(self):
        """ on_stop is called when the TaskSet is stopping """
        self.logout()

    def login(self):
        kv = '{0}:{1}'.format(environ['USER_EMAIL'], environ['USER_PASSWORD'])
        credentials = b64encode(kv.encode('utf-8')).decode('utf-8')
        rv = self.client.get('/users/tokens/', headers={
            'Authorization': 'Basic ' + credentials
        })
        self.token = loads(rv.content.decode('utf-8')).get('token')

    def logout(self):
        self.client.delete('/users/tokens/', headers={
            'Authorization': 'Bearer {}'.format(self.token)
        })

    @task(1)
    def get_projects(self):
        self.client.get("/projects/", headers={
            'Authorization': 'Bearer {}'.format(self.token)
        })


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    wait_time = between(5, 9)

