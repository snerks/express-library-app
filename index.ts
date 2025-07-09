import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Book type definition
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
}

// In-memory book store
let books = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    year: 1960,
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    year: 1949,
  },
  {
    id: 3,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    year: 1925,
  },
];
let nextId = 4;

// Homepage
app.get('/', (_req: Request, res: Response) => {
  res.send(
    '<h1>Welcome to the Book Library API</h1><p>Use the /api/books endpoint to manage books.</p>'
  );
});

// Get all books
app.get('/api/books', (_req: Request, res: Response) => {
  res.json(books);
});

// Get a single book
app.get('/api/books/:id', (req: Request, res: Response) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// Add a new book
app.post('/api/books', (req: Request, res: Response) => {
  const { title, author, genre, year } = req.body;
  if (!title || !author || !genre || !year) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const book: Book = { id: nextId++, title, author, genre, year };
  books.push(book);
  res.status(201).json(book);
});

// Update a book
app.put('/api/books/:id', (req: Request, res: Response) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  const { title, author, genre, year } = req.body;
  if (!title || !author || !genre || !year) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  book.title = title;
  book.author = author;
  book.genre = genre;
  book.year = year;
  res.json(book);
});

// Delete a book
app.delete('/api/books/:id', (req: Request, res: Response) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
