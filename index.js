const dotenv = require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors');
const {addBook, getBooks, getOneBook, updateBook, deleteBook, getAuthors, getOneAuthor, addAuthor} = require('./controllers')
const PORT = process.env.PORT || 5000

app
    .use(express.json())
    .use(cors())
    // Endpoints for Books
    .get("/book", async (req, res) => {
        try {
            const result = await getBooks()
            res.status(200).send(result)
        }
        catch (err) {
            res.status(406).send(err)
        }
    })
    .get("/book/:id", async (req, res) => {
        try {
            const result = await getOneBook(req.params.id)
            res.status(200).send(result)
        }
        catch (err) {
            res.status(406).send(err)
        }
    })
    .post("/book", async (req, res) => {
        try {
            const newBook = req.body
            const result = await addBook(newBook)
            res.status(201).send(result)
        }
        catch (err) {
            res.status(406).send(err)
        }
    })
    .patch("/book/:id", async (req, res) => {
        try {
            const updatedBook = req.body
            const result = await updateBook(req.params.id, updatedBook)
            res.status(201).send(result)
        }
        catch (err) {
            res.status(406).send(err)
        }
    })
    .delete("/book/:id", async (req, res) => {
        try {
            const result = await deleteBook(req.params.id)
            res.status(200).send(result)
        }
        catch (err) {
            res.status(406).send(err)
        }
    })
    // Endpoints for Authors
    .get("/author", async (req, res) => {
        const result = await getAuthors()
        res.status(200).send(result)
    })
    .get("/author/:id", async (req, res) => {
        const result = await getOneAuthor(req.params.id)
        res.status(200).send(result)
    })
    .post("/author", async (req, res) => {
        const newAuthor = req.body
        const result = await addAuthor(newAuthor)
        res.status(201).send(result)
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

