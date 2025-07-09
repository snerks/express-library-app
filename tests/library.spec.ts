import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Book Library API', () => {
  test('GET /api/books returns initial books', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/books`);
    expect(res.ok()).toBeTruthy();
    const books = await res.json();
    expect(Array.isArray(books)).toBeTruthy();
    expect(books.length).toBeGreaterThan(0);
    expect(books[0]).toHaveProperty('title');
    expect(books[0]).toHaveProperty('author');
    expect(books[0]).toHaveProperty('genre');
    expect(books[0]).toHaveProperty('year');
  });

  test('POST /api/books creates a new book', async ({ request }) => {
    const newBook = {
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Test Genre',
      year: 2025,
    };
    const res = await request.post(`${BASE_URL}/api/books`, {
      data: newBook,
    });
    expect(res.status()).toBe(201);
    const book = await res.json();
    expect(book).toMatchObject(newBook);
    expect(book).toHaveProperty('id');
  });

  test('PUT /api/books/:id updates a book', async ({ request }) => {
    // Create a book first
    const resCreate = await request.post(`${BASE_URL}/api/books`, {
      data: { title: 'To Update', author: 'A', genre: 'B', year: 2020 },
    });
    const book = await resCreate.json();
    const updated = { title: 'Updated', author: 'B', genre: 'C', year: 2021 };
    const res = await request.put(`${BASE_URL}/api/books/${book.id}`, {
      data: updated,
    });
    expect(res.ok()).toBeTruthy();
    const bookUpdated = await res.json();
    expect(bookUpdated).toMatchObject(updated);
  });

  test('DELETE /api/books/:id deletes a book', async ({ request }) => {
    // Create a book first
    const resCreate = await request.post(`${BASE_URL}/api/books`, {
      data: { title: 'To Delete', author: 'A', genre: 'B', year: 2020 },
    });
    const book = await resCreate.json();
    const res = await request.delete(`${BASE_URL}/api/books/${book.id}`);
    expect(res.status()).toBe(204);
  });
});

test.describe('Book Library UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('UI displays initial books', async ({ page }) => {
    const rows = page.locator('table#books-table tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('Can add a book via UI', async ({ page }) => {
    const uniqueTitle = `UI Book ${Date.now()}`;

    await page.fill('#title', uniqueTitle);
    await page.fill('#author', 'UI Author');
    await page.fill('#genre', 'UI Genre');
    await page.fill('#year', '2025');
    await page.click('button[type="submit"]');
    // Wait for the form to clear (indicates submission is processed)
    await expect(page.locator('#title')).toHaveValue('');
    // Wait for the new row to appear
    await expect(page.locator('tr', { hasText: uniqueTitle })).toBeVisible();
    await expect(page.locator('table#books-table')).toContainText(uniqueTitle);
  });

  //   test('Can edit a book via UI', async ({ page }) => {
  //     // Use a unique title for this test run
  //     const uniqueTitle = `Edit Me ${Date.now()}`;
  //     const editedTitle = `Edited Book ${Date.now()}`;
  //     await page.fill('#title', uniqueTitle);
  //     await page.fill('#author', 'Edit Author');
  //     await page.fill('#genre', 'Edit Genre');
  //     await page.fill('#year', '2025');
  //     await page.click('button[type="submit"]');
  //     // Wait for the form to clear
  //     await expect(page.locator('#title')).toHaveValue('');
  //     // Wait for the new row to appear
  //     const row = page.locator('tr', { hasText: uniqueTitle });
  //     await expect(row).toBeVisible();
  //     await row.getByRole('button', { name: 'Edit' }).click();
  //     await page.fill('#title', editedTitle);
  //     await page.click('button[type="submit"]');
  //     // Wait for the form to clear
  //     await expect(page.locator('#title')).toHaveValue('');
  //     // Wait for the row to update with the new title
  //     const editedRow = page.locator('tr', { hasText: editedTitle });
  //     await expect(editedRow).toBeVisible();
  //     await expect(editedRow).toContainText(editedTitle);
  //   });

  //   test('Can delete a book via UI', async ({ page }) => {
  //     // Use a unique title for this test run
  //     const uniqueTitle = `Delete Me ${Date.now()}`;
  //     await page.fill('#title', uniqueTitle);
  //     await page.fill('#author', 'Delete Author');
  //     await page.fill('#genre', 'Delete Genre');
  //     await page.fill('#year', '2025');
  //     await page.click('button[type="submit"]');
  //     // Wait for the form to clear
  //     await expect(page.locator('#title')).toHaveValue('');
  //     // Wait for the new row to appear
  //     const row = page.locator('tr', { hasText: uniqueTitle });
  //     await expect(row).toBeVisible();
  //     await row.getByRole('button', { name: 'Delete' }).click();
  //     await page.on('dialog', (dialog) => dialog.accept());
  //     // Wait for the row to be removed
  //     await expect(row).toHaveCount(0);
  //   });
});
