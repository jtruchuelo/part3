const { request } = require('express')
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function (req, res) {
    if (req.method === 'POST') return JSON.stringify(req.body)
})

app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

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
    },
    {
        "name": "Brandon",
        "number": "123-266234",
        "id": 5
    }
  ]


// Routes

/// Get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

/// Get person by id
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

/// Delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

/// Add new person
app.post('/api/persons', (request, response) => {
    const newPerson = request.body

    if (newPerson.name === '' || newPerson.number === '') {
        return response.status(400).json({
            error: 'Empty name or number'
        })
    }

    if (persons.find(p => p.name.trim().toLocaleLowerCase() === newPerson.name.trim().toLocaleLowerCase())) {
        return response.status(409).json({
            error: 'Name must be unique'
        })
    }

    newPerson.id = Math.floor(Math.random() * 100000)
    persons = persons.concat(newPerson)

    response.json(newPerson)
})

/// Get info
app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br/> <br/> ${new Date()} `)

})


// Server init
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log (`Server running on port ${PORT}`)
})