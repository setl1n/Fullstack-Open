const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("provide password");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kaungsetlin2008:${password}@fullstack-open.fzdq32a.mongodb.net/persons?retryWrites=true&w=majority&appName=fullstack-open`;

const addPersons = async (persons) => {
    for (let person of persons) {
        console.log("iterating through \"persons\" array: ", person);
        let newPerson = new Person({
            name: person.name,
            number: person.number,
            id: person.id
        })
        await newPerson.save();
        console.log("added: ", person);
    }
}

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(async () => {
        mongoose.set()
        console.log("connected!");
        if (process.argv.length === 3) {
            console.log("im here!");
            await addPersons(persons);
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.log("error connecting: ", err);
        process.exit()
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
});

const Person = mongoose.model('Person', personSchema);

const persons = [
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
