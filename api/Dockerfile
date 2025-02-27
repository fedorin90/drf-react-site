FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code/
RUN python -m pip install --upgrade pip
RUN pip install pipenv

COPY Pipfile Pipfile.lock ./
RUN pipenv install --system

COPY . /code/
WORKDIR /code/myproject/
