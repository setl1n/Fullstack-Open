const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("provide password");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kaungsetlin2008:${password}@fullstack-open.fzdq32a.mongodb.net/persons?retryWrites=true&w=majority&appName=fullstack-open`;

const printDatabase = () => {
    console.log("phonebook:");
    Person.find({}).then(result => {
        result.forEach(person => console.log(person.name, person.number));
        mongoose.connection.close();
    })
}

const saveToDataBase = ((name, number) => {
    const newPerson = new Person({ name, number });
    newPerson.save().then(() => {
        console.log(newPerson, "saved successfully");
        mongoose.connection.close();
    });
})

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(() => {
        console.log("connected!");
        if (process.argv.length === 3) {
            printDatabase();
        } else if (process.argv.length === 5) {
            saveToDataBase(process.argv[3], process.argv[4]);
        } else {
            console.log("unrecognised number of arguments");
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.log("error connecting: ", err);
        process.exit()
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);