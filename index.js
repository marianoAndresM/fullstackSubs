const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('person', function getInfo(request) {
  const person = JSON.stringify(request.body)
  return person
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/', (request, response) => {
  response.send("This is the homepage")
})

app.get('/info', (request, response) => {
  const time = new Date().toString()
  const numberOfPersons = persons.length
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${time}</p>`)
})

app.get('/api/persons', (request, response) => {

  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const MaxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return MaxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } else {
    const newName = body.name
    
    if  (persons.find((person) => person.name === newName)) {
      return response.status(400).json({
        error: "name must be unique"
      })
    } else {
      const newPerson = {
        id: generateId(),
        name: newName,
        number: body.number 
      }
      persons = persons.concat(newPerson)
      response.json(newPerson);
    }
  }
  generateId()
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})
