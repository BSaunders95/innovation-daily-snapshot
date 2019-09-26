import FeedbackValidator from '../validators/feedback'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGODB_URL

app.post('/feedback', (req, res) => {

  const errors = FeedbackValidator.validateSubmitFeedback(req.body)
  if (errors.hasErrors) {
    res.status(400).json(errors)
    return
  }

  const feedback = req.body

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('feedback').insert(feedback, function (err, result) {
      if (err) { throw err }
      db.close()

      res.status(201)
      res.end()
    })
  })
})

module.exports = {
  path: '/api',
  handler: app
}
