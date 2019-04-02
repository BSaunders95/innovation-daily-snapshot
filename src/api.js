// import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  async execute (method, resource, data) {
    return client({
      method,
      url: resource,
      data
    }).then(req => {
      return req.data
    })
  },
  getSnapshots (dept, time) {
    return this.execute('get', 'department' + dept + '/snapshot?time=' + time)
  },
  getCurrentDay (dept) {
    return this.execute('get', 'department' + dept + '/snapshot/currentDay')
  },
  getDayDetails (dept, date) {
    return this.execute('get', 'department' + dept + '/snapshot/day?date=' + date)
  },
  saveDailySnapshot (dept, snapshot) {
    return this.execute('post', 'department' + dept + '/snapshot', snapshot)
  },
  getSnapshotHistory (dept) {
    return this.execute('get', 'department' + dept + '/snapshot/history')
  }
}
