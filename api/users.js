import UserValidator from '../validators/users'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://chs-mongo:27017/'

app.get('/users', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('users').find().toArray(function (err, result) {
      if (err) { throw err }
      db.close()

      res.write(JSON.stringify(result))
      res.end()
    })
  })
})

app.get('/users/:id', (req, res) => {
  const userId = req.params.id
  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('users').find({ '_id': userId }).toArray(function (err, result) {
      if (err) { throw err }
      db.close()
      const data = result[0]

      res.write(JSON.stringify(data))
      res.end()
    })
  })
})

app.put('/users/:id', (req, res) => {

  const errors = UserValidator.validateCreateUser(req.body)
  if (errors.hasErrors) {
    res.status(400).json(errors)
    return
  }

  const userId = req.params.id
  const user = req.body

  user._id = userId

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('users').save(user, function (err, result) {
      if (err) { throw err }
      db.close()

      res.status(204)
      res.end()
    })
  })
})

app.post('/users', (req, res) => {

  const errors = UserValidator.validateCreateUser(req.body)
  if (errors.hasErrors) {
    res.status(400).json(errors)
    return
  }

  const user = req.body
  const names = req.body.name.split(' ')
  user._id = names[0].charAt(0).concat(names[1]).toLowerCase()

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('users').insert(user, function (err, result) {
      if (err) { throw err }
      db.close()

      res.write(JSON.stringify(result))
      res.end()
    })
  })
})

module.exports = {
  path: '/api',
  handler: app
}
