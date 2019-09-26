import DayPositionValidator from '../validators/dayPosition'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGODB_URL

app.get('/dayposition/:dept/latest', (req, res) => {
  const dept = req.params.dept

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('dayposition').find({ dept }).sort({ 'date': -1 }).limit(1).toArray(function (err, result) {
      if (err) { throw err }
      // Set standardized data; i.e: current day today = 0. This is incase no data exists to avoid an NPE
      const data = { 'latestDayPosition': 0, 'latestDayPositionDate': new Date().toISOString().split('T')[0] }
      if (result.length > 0) {
        data.latestDayPosition = result[0].dayPosition
        data.latestDayPositionDate = result[0].date
      }
      db.close()

      res.write(JSON.stringify(data))
      res.end()
    })
  })
})

app.get('/daypositions/:dept', (req, res) => {
  const dept = req.params.dept
  const time = parseInt(req.query.time, 10)

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('dayposition').find({ dept }).sort({ 'date': -1 }).limit(time).toArray(function (err, result) {
      if (err) { throw err }

      const xAxis = []
      const yAxis = []

      for (let i = result.length - 1; i >= 0; i--) {
        xAxis.push(result[i].date)
        yAxis.push(result[i].dayPosition)
      }

      const data = [xAxis, yAxis]

      db.close()

      res.write(JSON.stringify(data))
      res.end()
    })
  })
})

app.get('/dayposition/:dept', (req, res) => {
  const dept = req.params.dept
  const date = req.query.date

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('dayposition').find({ dept, date }).limit(1).toArray(function (err, result) {
      if (err) { throw err }

      if (result.length === 0) {
        res.write(JSON.stringify({ date }))
        res.end()
        return
      }

      const data = result[0]

      db.close()

      res.write(JSON.stringify(data))
      res.end()
    })
  })
})

app.get('/dayposition/:dept/history', (req, res) => {
  const dept = req.params.dept

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('dayposition').find({ dept }).sort({ 'date': -1 }).toArray(function (err, result) {
      if (err) { throw err }

      db.close()

      res.write(JSON.stringify(result))
      res.end()
    })
  })
})

app.post('/dayposition', function (req, res) {
  const dayPosition = req.body

  const errors = DayPositionValidator.validateSubmitDayPosition(dayPosition)
  if (errors.hasErrors) {
    res.status(400).json(errors)
    return
  }

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('dayposition').deleteOne({ 'dept': dayPosition.dept, 'date': dayPosition.date }, function (err, result) {
      if (err) { throw err }
      dbo.collection('dayposition').insertOne(dayPosition, function (err, result) {
        if (err) { throw err }

        db.close()

        res.status(204)
        res.end()
      })
    })
  })
})

module.exports = {
  path: '/api',
  handler: app
}
