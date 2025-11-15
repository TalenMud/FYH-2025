FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Waiting for database..."\n\
DB_HOST=${DB_HOST:-db}\n\
until pg_isready -h $DB_HOST -p 5432 -U postgres; do\n\
  echo "Waiting for database at $DB_HOST..."\n\
  sleep 2\n\
done\n\
echo "Database is ready!"\n\
python init_db.py || echo "Database already initialized or error occurred"\n\
exec "$@"' > /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Start server with gunicorn for production, flask for development
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "app:app"]
