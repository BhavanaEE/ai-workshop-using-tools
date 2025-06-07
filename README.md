# URL Shortener Application

A full-stack URL shortener application built with Node.js, Express, React, and SQLite.

## Features

- Create short URLs from long URLs
- 6-character alphanumeric short keys
- List of all shortened URLs
- Automatic redirection to original URLs
- Modern and responsive UI

## Tech Stack

- Backend: Node.js, Express
- Frontend: React
- Database: SQLite
- Additional: nanoid for generating short keys

## Setup Instructions

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   cd ..
   ```

4. Start the development servers:

   For backend only:
   ```bash
   npm run dev
   ```

   For frontend only:
   ```bash
   npm run client
   ```

   For both frontend and backend:
   ```bash
   npm run dev:full
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

- `POST /api/shorten` - Create a new short URL
  - Body: `{ "originalUrl": "https://example.com" }`
  - Returns: `{ "originalUrl", "shortUrl", "shortKey" }`

- `GET /api/urls` - Get all shortened URLs
  - Returns: Array of URL objects

- `GET /:shortKey` - Redirect to original URL
  - Example: `http://localhost:5000/abc123` redirects to the original URL

## Database

The application uses SQLite as its database. The database file (`urls.db`) will be created automatically when you first run the application. 