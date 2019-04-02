import VueHighcharts from 'vue2-highcharts'
import moment from 'moment'

const asyncData = {
  name: '',
  showInLegend: false,
  marker: {
    symbol: 'square'
  },
  data: []
}

const graphMixin = {
  components: {
    VueHighcharts,
    moment
  },
  data () {
    return {
      options: {
        chart: {
          type: 'line'
        },
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          categories: [],
          labels: {
            formatter: function () {
              return moment(new Date(this.value)).format('DD/MM/YYYY')
            }
          }
        },
        yAxis: {
          title: {
            text: '\'Day\''
          },
          min: 0,
          tickInterval: 1
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          line: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1
            }
          },
          series: {
            point: {
              events: {
                click: function () {
                  updateSelectedDate(this.category)
                }
              }
            }
          }
        },
        series: []
      }
    }
  },
  methods: {
    load: function () {
      let lineCharts = this.$refs.lineCharts
      lineCharts.delegateMethod('showLoading', 'Loading...')
      setTimeout(() => {
        lineCharts.removeSeries()
        lineCharts.addSeries(asyncData)
        lineCharts.hideLoading()
      }, 500)
    },
    setXAxis: function (x) {
      let xVars = this.options.xAxis.categories
      xVars.splice(0, xVars.length)
      // x has to be pushed to the array an entry at a time;
      // simply setting the 2 arrays equal doesn't do the trick...
      for (var i = 0; i < x.length; i++) {
        xVars.push(x[i])
      }
    },
    setYAxis: function (y) {
      asyncData.data = y
    },
    addData: function (x, y) {
      this.setYAxis(y)
      this.setXAxis(x)
      this.load()
    }
  }
}

function updateSelectedDate (date) {
  let selectedDate = document.getElementById('selectedDate')
  selectedDate.value = date
  selectedDate.dispatchEvent(new Event('change'))
}

export default graphMixin
