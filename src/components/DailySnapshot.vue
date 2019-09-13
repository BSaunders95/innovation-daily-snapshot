<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">{{pageHeader}}</h1>
    <h2 style="padding-bottom: 40px">
      <p>Current Day at {{latestDate}}: <b>{{currentDay}}</b></p>
      <b-progress :value="currentDay" :max="10" :variant="currentDayVariant"></b-progress>
    </h2>
    <b-row>
      <b-col>
        <div>
          <vue-highcharts :options="options" ref="lineCharts"></vue-highcharts>
        </div>
        <b-row class="justify-content-md-center">
          <b-col col sm="2">
            <b-form-select v-model="dateRange" :options="dateRangeSelectOptions" class="m-md-2"></b-form-select>
          </b-col>
        </b-row>
        <b-row class="justify-content-md-center">
          <b-col col sm="2">
            <div>&nbsp;</div><!-- Empty div for spacing for now -->
            <download-excel
              class   = "btn btn-success"
              :data   = "csv_data"
              :fields = "csv_fields"
              type    = "csv"
              :name   = "getCSVFileName()">
              Download History CSV
            </download-excel>
          </b-col>
        </b-row>
      </b-col>
      <b-col lg="3">
        <b-card title="Daily Snapshot">
          <form>
            <b-form-group label="Date">
              <b-form-input type="date" v-model=dayDetails.date id="selectedDate" :max="new Date().toISOString().split('T')[0]"></b-form-input>
            </b-form-group>
            <b-form-group label="Recieved">
              <b-form-input type="number" v-model.number=dayDetails.recieved></b-form-input>
            </b-form-group>
            <b-form-group label="Processed">
              <b-form-input type="number" v-model.number=dayDetails.processed></b-form-input>
            </b-form-group>
            <b-form-group label="Remaining">
              <b-form-input type="number" v-model.number=dayDetails.remaining></b-form-input>
            </b-form-group>
            <b-form-group label="Current Day">
              <b-form-input type="number" v-model.number=dayDetails.currentDay></b-form-input>
            </b-form-group>
            <div>
              <b-btn type="submit" variant="success" v-on:click="saveDailySnapshot">Save</b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import GraphMixin from '../mixins/graph'
import api from '@/api'
import moment from 'moment'
import Case from 'case'
import JsonExcel from 'vue-json-excel'

export default {
  data () {
    return {
      pageHeader: '',
      currentDay: 0,
      latestDate: null,
      currentDayVariant: '',
      dateRange: '5',
      dateRangeSelectOptions: [
        { value: '5', text: '5 Days' },
        { value: '10', text: '10 Days' },
        { value: '30', text: '30 Days' }
      ],
      snapshots: [],
      dayDetails: {},
      csv_fields: {
        'Date': 'date',
        'Recieved': 'recieved',
        'Processed': 'processed',
        'Remaining': 'remaining',
        'Current Day': 'currentDay'
      },
      csv_data: [],
      json_meta: [
        [
          {
            'key': 'charset',
            'value': 'utf-8'
          }
        ]
      ]
    }
  },
  mixins: [ GraphMixin ],
  methods: {
    async getSnapshots () {
      this.snapshots = await api.getSnapshots(this.getDepartment(), this.dateRange)
      this.addData(this.snapshots[0], this.snapshots[1])
    },
    async getCurrentDay () {
      var dayData = await api.getCurrentDay(this.getDepartment())
      this.currentDay = dayData.currentDay
      this.latestDate = moment(new Date(dayData.date)).format('DD/MM/YYYY')
      this.currentDayVariant = this.getCurrentDayVariant()
    },
    async getDayDetails () {
      var dayDetails = await api.getDayDetails(this.getDepartment(), this.dayDetails.date)
      if (dayDetails.length > 0) {
        this.dayDetails = dayDetails[0]
      }
    },
    async getSnapshotHistory () {
      this.csv_data = await api.getSnapshotHistory(this.getDepartment())
    },
    getCurrentDayVariant () {
      if (this.currentDay <= 3) {
        return 'success'
      } else if (this.currentDay <= 6) {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    async saveDailySnapshot () {
      api.saveDailySnapshot(this.getDepartment(), this.dayDetails)
    },
    setPageHeader () {
      this.pageHeader = Case.title(this.getDepartment())
    },
    getDepartment () {
      return this.$route.path
    },
    getCSVFileName () {
      return 'daily-snapshot-history' + this.getDepartment() + '_' + new Date().toISOString().split('T')[0]
    }
  },
  mounted () {
    this.setPageHeader()
    this.getSnapshots()
    this.getCurrentDay()
    this.getSnapshotHistory()
  },
  watch: {
    'dateRange': function () {
      this.getSnapshots()
    },
    'dayDetails.date': function () {
      this.getDayDetails()
    }
  },
  components: {
    'download-excel': JsonExcel
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
