const dotenv = require('dotenv').config()
const express = require('express')
const app = express();
const cors = require('cors');
const {addBook, getBooks, getOneBook} = require('./controllers')
const PORT = process.env.PORT || 5000

app
    .use(express.json())
    .use(cors())
    .get("/book", async (req, res) => {
        const result = await getBooks()
        res.status(201).send(result)
    })
    .get("/book/:id", async (req, res) => {
        const result = await getOneBook(req.params.id)
        res.status(201).send(result)
    })
    .post("/book", async (req, res) => {
        const newBook = req.body
        const result = await addBook(newBook)
        res.status(201).send(result)
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

