import os
import logging
import sys
from flask import Flask, render_template

app = Flask(__name__, static_folder='build/static', template_folder='build')
port = int(os.environ.get("PORT", 5000))

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
@app.route("/")
def hello():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='localhost', port=port)
