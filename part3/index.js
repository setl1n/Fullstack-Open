const express = require('express')

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]
const app = express();

const port = 3001
app.listen(port);

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/info', (req, res) => {
    const timestamp = new Date().toString();
    let info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${timestamp}</p>
    `
    res.send(info)
})
