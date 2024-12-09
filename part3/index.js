require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

const port = process.env.PORT

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
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

app.listen(port, () => {
    console.log("server is running on port: ", port);
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then((persons) => {
        console.log(JSON.stringify(persons));
        res.json(persons);
    })
})

app.get('/info', (req, res) => {
    const timestamp = new Date().toString();
    let info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${timestamp}</p>
    `
    res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log("finding person with matching id");
    let person = persons.find((person) => person.id === id);
    console.log("person found: ", person);
    if (!person) {
        return res.status(404).end();
    }
    res.json(person);
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    console.log("deleting person with id ", id);
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
    console.log("replacing person of id: ", req.params.id);
    console.log("with: ", JSON.stringify(req.body, null, 2));
    const newPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
            .then(updatedNote => {
                res.json(updatedNote);
            })
            .catch(error => next(error));
})

app.post('/api/persons', (req, res) => {
    let newPersonJSON = req.body;
    if (!newPersonJSON.name || !newPersonJSON.number) {
        return res.status(400).send({ error: "missing name or number" });
    }
    // if (persons.find((person) => person.name === newPersonToAdd.name)) {
    //     return res.status(400).send({ error: "name must be unique" });
    // }
    let name = newPersonJSON.name.toString();
    let number = newPersonJSON.number.toString();
    let newPersonToAdd = new Person({ name , number })
    newPersonToAdd.save().then((savedPerson) => {
        res.json(savedPerson);
    });
})

const errorHandler = (err, req, res, next) => {
    console.log(err);

    if (err.name == "CastError") {
        return res.status(400).send({error: "malformatted id"});
    }
    next(err)
}

app.use(errorHandler);

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint"});
}

app.use(unknownEndpoint);