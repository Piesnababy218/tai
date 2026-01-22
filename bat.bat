@echo off
start cmd /k "python manage.py runserver"
start cmd /k "cd frontend && npm start"
pause