const pgp = require('pg-promise')()

let db
if (process.env.DATABASE_URL) {
    db = pgp({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })
} else {
    const username = process.env.DB_USER
    const password = process.env.DB_PASS
    const host = process.env.DB_HOST
    const port = process.env.DB_PORT

    let uri = `postgres://${username}:${password}@${host}:${port}/library`
    db = pgp(uri);
}

// Functions for Books
async function getBooks() {
    const books = await db.query(`
        SELECT a.name author, b.title, b.description, b.id book_id
        FROM books AS b
        LEFT JOIN author AS a
        ON a.id = b.author_id;
    `);
    return books;
}

async function getOneBook(id) {
    const book = await db.one("SELECT a.name author, b.title, b.description, b.id book_id FROM books AS b LEFT JOIN author AS a ON a.id = b.author_id WHERE b.id = $1;", [id]);
    return book;
}

async function addBook(book) {
    const newBook = {
        title: book.title,
        description: book.description,
        author_id: book.authorId
    }
    const result = await db.one('INSERT INTO books(${this:name}) VALUES(${this:csv}) RETURNING id', newBook)
    return getOneBook(result.id);
}

async function updateBook(id, newBook) {
    await db.query("UPDATE ${table:name} SET title = '${newTitle:value}', description = '${newDescription:value}', author_id = ${authorId} WHERE id = ${bookId}", {
        table: 'books',
        bookId: id,
        newTitle: newBook.title,
        newDescription: newBook.description,
        authorId: newBook.author_id
    });
    return getOneBook(id);
}

async function deleteBook(id) {
    await db.query("DELETE FROM ${table:name} WHERE id = ${bookId}", {
        table: 'books',
        bookId: id
    });
    return true;
}

// Functions for Authors
async function getAuthors() {
    const authors = await db.query('SELECT ${columns:name} FROM ${table:name}', {
        columns: ['id', 'name', 'birthdate'],
        table: 'author'
    });
    return authors;
}

async function getOneAuthor(id) {
    const author = await db.query('SELECT ${columns:name} FROM ${table:name} WHERE id = ${authorId}', {
        columns: ['id', 'name', 'birthdate'],
        table: 'author',
        authorId: id
    });
    return author;
}

async function addAuthor(author) {
    const newAuthor = {
        id: author.id,
        name: author.name,
        birthdate: author.birthdate
    }
    await db.query('INSERT INTO author(${this:name}) VALUES(${this:csv})', newAuthor)
    return newAuthor
}


module.exports = {addBook, getBooks, getOneBook, updateBook, deleteBook, getAuthors, getOneAuthor, addAuthor}