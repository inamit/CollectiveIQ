FROM python:3.9-slim-bullseye

EXPOSE 8000
WORKDIR /similarPostsEngine

COPY ./requirements.txt /similarPostsEngine/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./.env /similarPostsEngine/.env
COPY ./app /similarPostsEngine/app

CMD ["fastapi", "run", "app/main.py", "--port", "8000"]