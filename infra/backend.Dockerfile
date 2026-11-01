FROM python:3.11-slim
RUN useradd -m app
WORKDIR /srv
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/
COPY backend/ .
USER app
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001", "--proxy-headers"]
