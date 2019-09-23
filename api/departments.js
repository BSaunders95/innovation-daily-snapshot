import DepartmentValidator from '../validators/departments'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://chs-mongo:27017/'

app.get('/departments', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('departments').find().toArray(function (err, result) {
      if (err) { throw err }
      db.close()

      res.write(JSON.stringify(result))
      res.end()
    })
  })
})

app.get('/departments/:id', (req, res) => {
  const departmentId = req.params.id
  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('departments').find({ '_id': departmentId }).toArray(function (err, result) {
      if (err) { throw err }
      db.close()
      const data = result[0]

      res.write(JSON.stringify(data))
      res.end()
    })
  })
})

app.put('/departments/:id', (req, res) => {
  const errors = DepartmentValidator.validateConfigureDepartment(req.body)
  if (errors.hasErrors) {
    res.status(400).json(errors)
    return
  }

  const departmentId = req.params.id
  const config = req.body

  config._id = departmentId

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('departments').save(config, function (err, result) {
      if (err) { throw err }
      db.close()

      res.status(204)
      res.end()
    })
  })
})

app.post('/departments', (req, res) => {
  const errors = DepartmentValidator.validateCreateDepartment(req.body)
  if (errors.hasErrors) {
    res.status(400).json(errors)
    return
  }

  const department = req.body

  department._id = department.name.trim().split(' ').join('').toLowerCase()

  MongoClient.connect(url, function (err, db) {
    if (err) { throw err }
    const dbo = db.db('daily_snapshot')
    dbo.collection('departments').insert(department, function (err, result) {
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
