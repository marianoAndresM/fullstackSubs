const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = 'mongodb+srv://fullstack:mongoDB@cluster0.2x3hh.mongodb.net/phonebookDB?retryWrites=true&w=majority'

console.log("connecting to ", url);

mongoose.connect(url)
  .then(result => {
    console.log("connected to MongoDB");
  }) 
  .catch(err => {
    console.log("there was an error", err.message);
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true
  },
  id: String
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)