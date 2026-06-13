#!/bin/bash
set -e

python manage.py collectstatic --noinput
python manage.py migrate
exec gunicorn hospital_backend.wsgi:application --bind 0.0.0.0:${PORT:-8000} --log-file -
