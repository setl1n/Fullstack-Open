const express = require('express')
const morgan = require('morgan')
const app = express();
app.use(express.json())

app.use(morgan(function (tokens, req, res) {
    let ret = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ]
    if (req.method === 'POST') {
        console.log(req.body);
        ret.push(...[JSON.stringify(req.body)]);
    }
    return ret.join(' ');
  }));

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

app.get('/api/person/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log("finding person with matching id");
    let person = persons.find((person) => person.id === id);
    console.log("person found: ", person);
    if (!person) {
        return res.status(404).end();
    }
    res.json(person);
})

app.delete('/api/person/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log("deleting person with id ", id);
    persons = persons.filter((person) => person.id !== id);
    console.log("new persons list: ", persons);
    res.status(204).send();
})

app.post('/api/persons', (req, res) => {
    let newPersonToAdd = JSON.parse(JSON.stringify(req.body));
    if (!newPersonToAdd.name || !newPersonToAdd.number) {
        return res.status(400).send({ error: "missing name or number" });
    }
    if (persons.find((person) => person.name === newPersonToAdd.name)) {
        return res.status(400).send({ error: "name must be unique" });
    }
    let newID = Math.floor(Math.random() * 99999);
    newPersonToAdd["id"] = newID;
    console.log("new person add: ",newPersonToAdd )
    persons = persons.concat(newPersonToAdd);
    console.log("persons list after adding: ", persons);
    res.status(200);
    res.send("person added successfully");
})