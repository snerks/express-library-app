# Express Library App

This is a simple Node.js Express web app to manage a book library.

## Features

- Add, view, edit, and delete books
- Each book has a title, author, genre, and publication year
- RESTful API endpoints
- In-memory data store (no database required)

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   npm start
   ```
3. The API will be available at `http://localhost:3000/api/books`

## API Endpoints

- `GET /api/books` - List all books
- `GET /api/books/:id` - Get a single book
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Example Book Object

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "year": 2024
}
```

## Homepage

Visit `http://localhost:3000/` for a simple homepage with instructions.
