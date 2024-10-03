# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for building Python packages (e.g., pycairo, pygobject)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libcairo2-dev \
    pkg-config \
    python3-dev \
    build-essential \
    meson \
    gobject-introspection \
    libgirepository1.0-dev \
    && apt-get clean

# Create a non-root user and set permissions for the app directory
RUN useradd -m myuser && chown -R myuser:myuser /app

# Copy the requirements file into the container
COPY requirements.txt ./

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY --chown=myuser:myuser . .

# Switch to the non-root user
USER myuser

# Set environment variables
ENV PYTHONUNBUFFERED=1
