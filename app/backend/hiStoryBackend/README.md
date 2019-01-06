http://history-backend.herokuapp.com

#### ABOUT THE PROJECT
This is the `Django` project serving as the backend for **HiStory** web and Android clients.
You can see the provided API endpoints [here](https://github.com/bounswe/bounswe2018group7/wiki/API-Endpoints).

#### RUNNING THE PROJECT
1. Make sure you have `Python 3.6.6` and `python3-pip` installed on your system.

2. Copy/Clone this directory (`hiStoryBackend`) to your system and open a `Terminal` in it.

3. Create a virtual environment to install required libraries.

    `python3 -m venv <venv_name>`
    
4. Active virtual environment:

    `source <venv_name>/bin/activate`
    
5. Install required packages/libraries from `requirements.txt` (This will install `Django 2.1.2` and a bunch of other packages):

    `pip install -r requirements.txt`
    
6. Create migration files for database:

    `python manage.py makemigrations`
    
7. Apply migrations:

    `python manage.py migrate`
    
8. Run server:

    `python manage.py runserver`

#### ABOUT ENVIRONMENT VARIABLES
There are several variables in `hiStoryBackend/settings.py` that you might need to know about:
* `DEBUG`: By default, the project runs in debug mode. To turn it off set this to a` False` equivalent (in Python) value (e.g. the empty string)

* `DATABASE_URL`: By default, the porject uses `Sqlite3` as its database. To use another database system, set this variable. 

* `SITE_URL`: The url of the server on which the project runs. Default is local (`http://127.0.0.1:8000/`)

* `MEDIA_SITE_URL`: The url of the server where the media files uploaded to the system is stored. This is used to prevent external images from being used as targets in Annotations.

* `FRONTEND_CONFIRMATION_BASE_URL`: The base url which is used to create email confirmation links.

* `FRONTEND_PASSWORD_RESET_BASE_URL`: The base url which is used to create pasword reset links.

***

* `EMAIL_HOST`: Host of the email server (e.g., `smtp.gmail.com`)
* `EMAIL_HOST_USER`: The email address which will be used to send emails to users
* `EMAIL_HOST_PASSWORD`: The password of `EMAIL_HOST_USER`

    **NOTE:** If the 3 variables above are sent, actual emails will be sent to the users. Else, email body will be printed on the console.

***

* `MEDIA_ROOT`: By default, media files uploaded to the sytem will be stored under the path stated by this variable. To use an `Amazon S3 Bucket` as storage backend, set the following variables: `AWS_S3_ACCESS_KEY_ID`, `AWS_S3_SECRET_ACCESS_KEY` and `AWS_STORAGE_BUCKET_NAME`

* `REC_REQUEST_URL`: The **Recommendation** system of the project relies on [this](https://github.com/bounswe/bounswe2018group7/tree/backend/app/backend/tag_similarity) CPP program. For the system to work, this CPP program must be available on the url stated by this variable.
