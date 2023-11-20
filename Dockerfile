ARG PYTHON_VERSION=3.10.12
FROM python:${PYTHON_VERSION}-slim as base
USER root

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONUNBUFFERED=1

WORKDIR /app


RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt
    
RUN --mount=type=bind,source=./app/db,target=/app/db:rw
RUN --mount=type=bind,source=./app/temp,target=/app/temp

COPY app/db/db.yaml /app/db/

COPY . .
EXPOSE 4000

CMD python3 app/main.py
