#!/bin/bash
python manage.py migrate
gunicorn hospital_backend.wsgi --log-file -