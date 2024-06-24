const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("mongodb connect!");
    })
    .catch((e) => {
        console.log("error connecting to mongodb");
        console.log(e);

    })


const personSchema = mongoose.Schema({
    name: String,
    number: String
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
})

module.exports = mongoose.model("Person", personSchema);