FROM python:3.9-slim-bullseye

EXPOSE 8000
WORKDIR /similarPostsEngine

COPY ./requirements.txt /similarPostsEngine/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /similarPostsEngine/requirements.txt

COPY ./app /similarPostsEngine/app

CMD ["fastapi", "run", "app/main.py", "--port", "8000"]