from flask import Flask

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__)
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Specifies maximum size of the file to be uploaded as 16MB.
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
