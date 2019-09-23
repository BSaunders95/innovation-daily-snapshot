<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      <span v-text="department.name"></span>
    </h1>
    <p>
      Below you can configure settings for the department; success markers are used to determine a day position's 'success'
    </p>
    <p>
      Please state the maximum possible day position
    </p>
    <b-col>
      <b-row class="justify-content-md-center">
        <b-col lg="5">
          <b-row class="justify-content-md-center">
            <b-col lg="3">
              <b-input-group prepend="Max:" class="mt-3">
                <b-form-input v-model.number="department.maxDayPosition" type="number"></b-form-input>
              </b-input-group>
            </b-col>
          </b-row>
          <b-alert v-model="hasConfigErrors" variant="danger" style="margin-top: 20px">
            {{ errors.configError }}
          </b-alert>
          <p style="padding-top: 20px; padding-bottom: 20px">
            Configure the maximum day position considered a success:
          </p>
          <ejs-slider
            ref="max_success_slider"
            :value="department.maxSuccess"
            :max="department.maxDayPosition"
            showButtons="true"
            type="MinRange"
            :ticks="ticks"
            :tooltip="tooltip"
            :changed="successChanged"></ejs-slider>
          <p style="padding-top: 20px; padding-bottom: 20px">
            Configure the maximum day position considered a warning:
          </p>
          <ejs-slider
            ref="max_warning_slider"
            :value="department.maxWarning"
            :max="department.maxDayPosition"
            showButtons="true"
            type="MinRange"
            :ticks="ticks"
            :tooltip="tooltip"
            :changed="warningChanged"></ejs-slider>
          <b-row class="justify-content-md-center">
            <b-btn variant="success" @click="saveConfig">
              Save!
            </b-btn>
          </b-row>
        </b-col>
      </b-row>
    </b-col>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      tooltip: { isVisible: true, showOn: 'Always' },
      ticks: { placement: 'After', largeStep: 2, smallStep: 1, showSmallTicks: true },
      department: {
        name: '',
        maxDayPosition: 10,
        maxSuccess: 3,
        maxWarning: 7
      },
      errors: {},
      hasConfigErrors: false
    }
  },
  mounted () {
    this.configureSliders()
    this.getDepartment()
  },
  methods: {
    async getDepartment () {
      const { data } = await axios.get('/api/departments/' + this.$route.params.id)
      this.department.name = data.name
      if (typeof data.maxDayPosition !== 'undefined') {
        this.department.maxDayPosition = data.maxDayPosition
        this.department.maxSuccess = data.maxSuccess
        this.department.maxWarning = data.maxWarning
      }
    },
    successChanged (args) {
      this.clearErrors()
      this.department.maxSuccess = args.value
    },
    warningChanged (args) {
      this.clearErrors()
      this.department.maxWarning = args.value
    },
    saveConfig () {
      axios.put('/api/departments/' + this.$route.params.id, this.department)
        .then((resp) => {
          if (resp.status === 204) {
            window.location.href = '/departments'
          }
        }).catch((e) => {
          this.errors = e.response.data
          if (typeof this.errors.configError !== 'undefined') {
            this.hasConfigErrors = true
          }
        })
    },
    clearErrors () {
      this.errors = {}
      this.hasConfigErrors = false
    },
    configureSliders () {
      this.$refs.max_success_slider.$el.querySelector('.e-range').style.backgroundColor = 'green'
      this.$refs.max_success_slider.$el.querySelector('.e-handle').style.backgroundColor = 'green'
      this.$refs.max_warning_slider.$el.querySelector('.e-range').style.backgroundColor = 'darkOrange'
      this.$refs.max_warning_slider.$el.querySelector('.e-handle').style.backgroundColor = 'darkOrange'
    }
  }
}
</script>

<style>
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-popups/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
</style>
