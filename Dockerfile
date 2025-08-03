FROM python:3.14-rc-alpine
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir flask

CMD ["flask", "run", "--host=0.0.0.0"]