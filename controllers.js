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
    const books = await db.query('SELECT ${columns:name} FROM ${table:name}', {
        columns: ['id', 'title', 'description'],
        table: 'books'
    });
    return books;
}

async function getOneBook(id) {
    const book = await db.query('SELECT ${columns:name} FROM ${table:name} WHERE id = ${bookId}', {
        columns: ['id', 'title', 'description'],
        table: 'books',
        bookId: id
    });
    return book;
}

async function addBook(book) {
    const newBook = {
        title: book.title,
        description: book.description,
        author_id: book.authorId
    }
    await db.query('INSERT INTO books(${this:name}) VALUES(${this:csv})', newBook)
    return newBook
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


module.exports = {addBook, getBooks, getOneBook, getAuthors, getOneAuthor, addAuthor}