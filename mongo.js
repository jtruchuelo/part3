const mongoose = require('mongoose')

// console.log (process.argv)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.vnzsksn.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
}, { collection: 'persons' })
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook!`)
    mongoose.connection.close()
  })

} else {
  console.log('Please provide the correct arguments: node mongo.js <password> ?<name> ?<number>')
  process.exit(1)
}