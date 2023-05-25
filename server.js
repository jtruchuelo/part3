require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function (req, res) {
  if (req.method === 'POST') return JSON.stringify(req.body)
})

app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))


// Error middleware

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// Unknown endpoint middleware

const unknownEndpoint = (request, response) => response.status(404).send({ error: 'unknown endpoint' })


// Routes

/// Get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

/// Get person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
})

/// Add new person
app.post('/api/persons', (request, response, next) => {

  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })

  if (newPerson.name === '' || newPerson.number === '') {
    return response.status(400).json({
      error: 'Empty name or number'
    })
  }

  newPerson.save().then(result => {
    console.log('Nuevo usuario agregado')
    response.json(result)
  })
    .catch(error => next(error))
})

/// Update a person

app.put('/api/persons/:id', (request, response, next) => {

  const person = {
    name: request.body.name,
    number: request.body.number
  }

  const opts = {
    new: true,
    runValidators: true
  }

  Person.findByIdAndUpdate(request.params.id, person, opts)
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})


/// Get info
app.get('/info', (request, response) => {

  Person.find()
    .then(result => response.send(`Phonebook has info for ${result.length} people <br/> <br/> ${new Date()} `))
})

app.use(unknownEndpoint)
app.use(errorHandler)

// Server init
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))