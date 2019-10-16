import os
import sys
import logging

import urllib.request
from app import app
from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

# def allowed_file(filename):
# 	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__, static_folder='build/static', template_folder='build')
port = int(os.environ.get("PORT", 5000))

app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)
@app.route("/")
def hello():
    return render_template('index.html')

# @app.route('/', methods=['POST'])
# def upload_file():
# 	if request.method == 'POST':
#         # check if the post request has the files part
# 		if 'files[]' not in request.files:
# 			flash('No file part')
# 			return redirect(request.url)
# 		files = request.files.getlist('files[]')
# 		for file in files:
# 			if file and allowed_file(file.filename):
# 				filename = secure_filename(file.filename)
# 				file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
# 		flash('File(s) successfully uploaded')
# 		return redirect('/')

if __name__ == '__main__':
    app.run(host='localhost', port=port)
