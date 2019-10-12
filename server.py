import os
from flask import Flask, render_template

app = Flask(__name__, static_folder='build/static', template_folder='build')

@app.route("/")
def hello():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True, debug=True)
