# InAGlobe

## Prequisiites
- Python 3.7
- Redis
- NodeJS
- AWS RDS instance with access keys configured as environemnt variables

Define your `.env` file for the environment variables
```
FLASK_APP='./backend/run.py'
FLASK_ENV='development'
HEROKU_APP='SET YOUR OWN HEROKU APP'
SECRET_KEY='SET YOUR OWN'
SECURITY_PASSWORD_SALT='PASSWORD SALT FOR RESET PASSWORD'
APP_MAIL_USERNAME='YOUR GMAIL USERNAME'
APP_MAIL_PASSWORD='YOUR GMAIL CONFIG'
SITE_URL='REFERENCE TO FRONTEND SERVER'
REDIS_URL='REFERENNCE TO LOCAL REDIS SERVER'
REACT_APP_API_URL='REFERENCE TO BACKEND SERVER'
REACT_APP_AWS_ACCESS_KEY='AWS RDS ACCESS KEY'
REACT_APP_AWS_SECRET_KEY='AWS RDS SECRET KEY'
REACT_APP_GA_ID='GOOGLE ANALYTICS ID'
REACT_APP_BUCKET='S3 Bucket Name'
REACT_APP_GMAPS_API_KEY="GOOGLE MAPS API KEY"
REACT_APP_GEOCODE_KEY="GOOGLE MAPS GEOCODE KEY"
DATABASE_URL=AWS RDS DATABASE URL
APP_SETTINGS='config.DevelopmentConfig'
```

## How to use

- Create a python virtual environment (3.7), and run `pip install -r requirements.txt`
- Run `npm install` to install frontend dependencies
- Run `npm run dev` to start a local development frontend server.
- Run `redis-server` to start a local Redis server.
- Run `gunicorn backend.run:app -k gevent -b 127.0.0.1:5000 -t 99999` to start the backend server.
