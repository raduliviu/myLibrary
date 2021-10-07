const express = require('express')
const app = express();
const cors = require('cors');
const {addBook} = require('./controllers')
const PORT = process.env.PORT || 5000

app
    .use(express.json())
    .use(cors())
    .post("/book", async (req, res) => {
        const newBook = req.body
        const result = await addBook(newBook)
        res.status(201).send(result)
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

