const mongoose = require('mongoose')


const password = process.argv[2]
const dbName = "phonebookDB"

const url = `mongodb+srv://fullstack:${password}@cluster0.2x3hh.mongodb.net/${dbName}?retryWrites=true&w=majority
`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number : String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]
    const person = new Person({
    name: newName,
    number: newNumber
  })
  person.save().then(result => {
      console.log(`added ${newName} number ${newNumber} to phonebook`)
      mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
  console.log("phonebook:")
  Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    })
  mongoose.connection.close()
  })
}
  