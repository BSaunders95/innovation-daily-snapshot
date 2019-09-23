const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const bodyParser = require('body-parser')

const express = require('express')
const app = express()
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://chs-mongo:27017/'

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('users').find({ '_id': username, password }).toArray(function (err, result) {
      if (err) { throw err }
      db.close()

      if (result.length === 0) {
        res.status(404)
        res.end()
        return
      }

      const user = result[0]

      const accessToken = jsonwebtoken.sign({ user }, 'dummy')

      res.json({ token: accessToken })
    })
  })
})

app.post('/auth/logout', (req, res) => {
  res.json({ status: 'OK' })
})

app.get('/auth/user', jwt({ secret: 'dummy' }), (req, res, next) => {
  res.json({ user: req.user.user })
})

module.exports = {
  path: '/api',
  handler: app
}
