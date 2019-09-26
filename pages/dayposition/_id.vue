<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      {{ department.name }}
    </h1>
    <h2 style="padding-bottom: 40px">
      <p>
        Latest day position
        <b>
          {{ latestDayPosition }}
        </b> at {{ latestDayPositionDate }}
      </p>
      <b-progress :value="latestDayPosition" :max="department.maxDayPosition" :variant="latestDayPositionVariant"></b-progress>
    </h2>
    <b-row>
      <b-col>
        <b-row class="justify-content-md-center">
          <b-col col sm="2">
            <b-form-select v-model="dateRange" :options="dateRangeSelectOptions" class="m-md-2"></b-form-select>
          </b-col>
        </b-row>
        <div>
          <vue-highcharts :options="options" ref="lineCharts"></vue-highcharts>
        </div>
        <b-row v-if="$auth.$state.loggedIn && ($auth.$state.user.superUser || $auth.$state.user.authRoles.includes($route.params.id))" class="justify-content-md-center">
          <b-col col sm="2">
            <b-btn id="showModalBtn" pill variant="outline-secondary" @click="showAddOrChangeDayPosition = true">
              +
            </b-btn>
          </b-col>
        </b-row>
        <b-row v-if="$auth.$state.loggedIn && ($auth.$state.user.superUser || $auth.$state.user.authRoles.includes($route.params.id))" class="justify-content-md-center">
          <b-col sm="2">
            <div>&nbsp;</div>
            <download-excel
              class="btn btn-outline-secondary"
              :data="csv_data"
              :fields="csv_fields"
              type="csv"
              :name="getCSVFileName()">
              Download history CSV
            </download-excel>
          </b-col>
        </b-row>
      </b-col>
      <b-modal v-model="showAddOrChangeDayPosition" title="Day position" name="show-add-or-change-day-position" header-bg-variant="secondary" @hide="clearErrors">
        <b-alert v-model="hasDayPositionError" variant="danger">
          {{ errors.dayPositionError }}
        </b-alert>
        <b-card>
          <form>
            <b-form-group label="Date">
              <b-form-input v-model="dayPositionDetails.date" type="date" :max="new Date().toISOString().split('T')[0]"></b-form-input>
            </b-form-group>
            <b-form-group label="Recieved">
              <b-form-input v-model.number="dayPositionDetails.received" type="number"></b-form-input>
            </b-form-group>
            <b-form-group label="Processed">
              <b-form-input v-model.number="dayPositionDetails.processed" type="number"></b-form-input>
            </b-form-group>
            <b-form-group label="Remaining">
              <b-form-input v-model.number="dayPositionDetails.remaining" type="number"></b-form-input>
            </b-form-group>
            <b-form-group label="Day position">
              <b-form-input v-model.number="dayPositionDetails.dayPosition" type="number"></b-form-input>
            </b-form-group>
          </form>
        </b-card>
        <template v-slot:modal-footer>
          <b-button
            variant="outline-secondary"
            size="sm"
            class="float-right"
            @click="saveDayPositionDetails"
          >
            Save
          </b-button>
        </template>
      </b-modal>
    </b-row>
    <b-form-input id="selectedDate" v-model="dayPositionDetails.date" type="date" hidden></b-form-input>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import GraphMixin from '../../mixins/graph'

export default {
  mixins: [ GraphMixin ],
  data () {
    return {
      department: {},
      latestDayPosition: 0,
      latestDayPositionDate: null,
      latestDayPositionVariant: '',
      dateRange: '30',
      dateRangeSelectOptions: [
        { value: '30', text: '30 Days' },
        { value: '60', text: '60 Days' },
        { value: '90', text: '90 Days' }
      ],
      snapshots: [],
      dayPositionDetails: {},
      csv_fields: {
        'Date': 'date',
        'Received': 'received',
        'Processed': 'processed',
        'Remaining': 'remaining',
        'Day Position': 'dayPosition'
      },
      csv_data: [],
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ],
      showAddOrChangeDayPosition: false,
      errors: {},
      hasDayPositionError: false
    }
  },
  watch: {
    'dateRange' () {
      this.getDayPositions()
    },
    'dayPositionDetails.date' () {
      this.getDayPositionDetails()
    }
  },
  methods: {
    async getDepartment () {
      const self = this
      await axios.get('/api/departments/' + this.$route.params.id).then(function (response) {
        self.department = response.data
        self.getLatestDayPosition()
        self.getDayPositions()
      })
    },
    async getDayPositionHistory () {
      const self = this
      await axios.get('/api/dayposition/' + this.$route.params.id + '/history').then(function (response) {
        self.csv_data = response.data
      })
    },
    getDayPositions () {
      const self = this
      axios.get('/api/daypositions/' + this.$route.params.id + '?time=' + this.dateRange).then(function (response) {
        self.addData(response.data[0], response.data[1])
        self.$refs.lineCharts.chart.yAxis[0].addPlotLine({
          color: '#28a745',
          width: 3,
          value: self.department.maxSuccess
        })
        self.$refs.lineCharts.chart.yAxis[0].addPlotLine({
          color: '#ffc107',
          width: 3,
          value: self.department.maxWarning
        })
      })
    },
    getLatestDayPosition () {
      const self = this
      axios.get('/api/dayposition/' + self.$route.params.id + '/latest').then(function (response) {
        self.latestDayPosition = response.data.latestDayPosition
        self.latestDayPositionDate = moment(new Date(response.data.latestDayPositionDate)).format('DD/MM/YYYY')

        if (self.latestDayPosition <= self.department.maxSuccess) {
          self.latestDayPositionVariant = 'success'
        } else if (self.latestDayPosition <= self.department.maxWarning) {
          self.latestDayPositionVariant = 'warning'
        } else {
          self.latestDayPositionVariant = 'danger'
        }
      })
    },
    getDayPositionDetails () {
      if (typeof this.dayPositionDetails.date !== 'undefined') {
        const self = this
        axios.get('/api/dayposition/' + self.$route.params.id + '?date=' + self.dayPositionDetails.date).then(function (response) {
          delete response.data._id
          self.dayPositionDetails = response.data
        })
      }
    },
    saveDayPositionDetails () {
      const self = this
      self.dayPositionDetails.dept = self.$route.params.id
      axios.post('/api/dayposition', self.dayPositionDetails)
        .then((response) => {
          self.showAddOrChangeDayPosition = false
          self.dayPositionDetails = {}
          self.getLatestDayPosition()
          self.getDayPositions()
          self.getDayPositionHistory()
        }).catch((e) => {
          self.errors = e.response.data
          if (typeof self.errors.dayPositionError !== 'undefined') {
            self.hasDayPositionError = true
          }
        })
    },
    getCSVFileName () {
      return 'daily-snapshot-history-' + this.$route.params.id + '-' + new Date().toISOString().split('T')[0]
    },
    clearErrors () {
      this.errors = {}
      this.hasDayPositionError = false
    }
  },
  mounted () {
    this.getDepartment()
    this.getDayPositionHistory()
  }
}
</script>

<style>
  h1, h2 {
    font-weight: normal
  }

  ul {
    list-style-type: none;
    padding: 0
  }

  li {
    display: inline-block;
    margin: 0 10px
  }

  a {
    color: #35495E
  }
</style>
