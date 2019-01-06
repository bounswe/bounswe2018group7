import os

import dj_database_url
import django_heroku

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'tr52&u^)2b$ro+q(#s!q^8w5b(3*ushsqq-(w8%g$v^0o+c6@(')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(os.environ.get('DJANGO_DEBUG', True))

# URL of the server on which this project runs
SITE_URL = os.environ.get('SITE_URL', 'http://127.0.0.1:8000/')

# URL of the media storage server
MEDIA_SITE_URL = os.environ.get('MEDIA_SITE_URL', '')

API_VERSION = os.environ.get('API_VERSION', '1')

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'corsheaders',
	'api.apps.ApiConfig',
	'rest_framework',
	'rest_framework.authtoken',
]

REST_FRAMEWORK = {
	'DEFAULT_AUTHENTICATION_CLASSES': (
		'rest_framework.authentication.TokenAuthentication',
	),
	'DEFAULT_PERMISSION_CLASSES': (
		'rest_framework.permissions.IsAuthenticated',
	),
	'EXCEPTION_HANDLER': 'api.helpers.custom_helpers.custom_exception_handler',
	'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
	'DATETIME_FORMAT': '%d-%m-%Y %H:%M:%S',
}

# EMAIL SETTINGS
FRONTEND_CONFIRMATION_BASE_URL = os.environ.get('DJANGO_FRONTEND_CONFIRMATION_BASE_URL')
FRONTEND_PASSWORD_RESET_BASE_URL = os.environ.get('DJANGO_FRONTEND_PASSWORD_RESET_BASE_URL')

EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

if EMAIL_HOST and EMAIL_HOST_USER and EMAIL_HOST_PASSWORD:
	EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
	EMAIL_PORT = os.getenv('EMAIL_PORT', 587)
	EMAIL_USE_TLS = bool(os.getenv('EMAIL_USE_TLS', True))
else:
	EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

MIDDLEWARE = [
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'corsheaders.middleware.CorsMiddleware',
	'django.middleware.common.CommonMiddleware',
	# 'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'hiStoryBackend.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'hiStoryBackend.wsgi.application'

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.sqlite3',
		'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
	}
}
DATABASES['default'].update(dj_database_url.config(conn_max_age=500))

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
	{
		'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
	},
	{
		'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
	},
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

AUTH_USER_MODEL = 'api.User'


# CORS SETTINGS
CORS_ORIGIN_ALLOW_ALL = True


# The absolute path to the directory where collectstatic will collect static files for deployment.
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# The URL to use when referring to static files (where they will be served from)
STATIC_URL = '/static/'

# MEDIA FILES
MEDIA_ROOT = os.path.join(BASE_DIR, 'media/')
MEDIA_URL = '/media/'

# AWS CREDENTIALS
AWS_S3_ACCESS_KEY_ID = os.environ.get('DJANGO_AWS_S3_ACCESS_KEY_ID')
AWS_S3_SECRET_ACCESS_KEY = os.environ.get('DJANGO_AWS_S3_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('DJANGO_AWS_STORAGE_BUCKET_NAME')

if AWS_S3_ACCESS_KEY_ID and AWS_S3_SECRET_ACCESS_KEY and AWS_STORAGE_BUCKET_NAME:
	DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
	AWS_QUERYSTRING_AUTH = False  # Don't add complex authentication-related query parameters for requests

# RECOMMENDATION MECHANISM
REC_REQUEST_URL = os.environ.get('REC_REQUEST_URL')
REC_NUMBER_OF_RANDOM_USER_POSTS = int(os.environ.get('REC_NUMBER_OF_RANDOM_USER_POSTS', 5))
REC_NUMBER_OF_RANDOM_OTHER_POSTS = int(os.environ.get('REC_NUMBER_OF_RANDOM_OTHER_POSTS', 15))
REC_NUMBER_OF_RESULTS = int(os.environ.get('REC_NUMBER_OF_RESULTS', 5))


django_heroku.settings(locals())
