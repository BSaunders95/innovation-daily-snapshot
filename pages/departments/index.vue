<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      Departments
    </h1>
    <p>
      Please see below a list of departments actively participating in this project
    </p>
    <b-col>
      <b-row class="justify-content-md-center">
        <b-col col sm="4">
          <b-table :items="departments" fixed>
            <template v-slot:cell(config)="row">
              <span v-if="row.item.config">
                <div style="max-width: 120px; margin: auto; text-align: left;">
                  <span>
                    <img src="../../static/success.png" alt="Success" height="24" width="24" />
                    <strong>
                      0 &rarr; {{ row.item.config.maxSuccess }}
                    </strong>
                  </span>
                </div>
                <div style="max-width: 120px; margin: auto; text-align: left;">
                  <span>
                    <img src="../../static/warning.png" alt="Average" height="24" width="24" />
                    <strong>
                      {{ row.item.config.maxSuccess }} &rarr; {{ row.item.config.maxWarning }}
                    </strong>
                  </span>
                </div>
                <div style="max-width: 120px; margin: auto; text-align: left;">
                  <span>
                    <img src="../../static/error.png" alt="Warning" height="24" width="24" />
                    <strong>
                      {{ row.item.config.maxWarning }} &rarr; {{ row.item.config.maxDayPosition }}
                    </strong>
                  </span>
                </div>
              </span>
              <span v-else>
                Not yet configured
              </span>
            </template>
            <template v-slot:cell(edit)="row">
              <a :href="'/departments/' + row.item.edit">
                <img src="../../static/edit.png" alt="Edit" height="24" width="24" />
              </a>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-col>
    <b-col>
      <b-row class="justify-content-md-center">
        <b-col col sm="2">
          <b-btn pill variant="outline-secondary" @click="showAddDepartment = true">
            +
          </b-btn>
          <b-modal v-model="showAddDepartment" title="Add Department" header-bg-variant="secondary" @hide="clearErrors">
            <b-alert v-model="hasNameErrors" variant="danger">
              {{ errors.nameError }}
            </b-alert>
            <b-input-group>
              <b-form-input v-model="departmentToAdd"></b-form-input>
            </b-input-group>
            <template v-slot:modal-footer>
              <b-button
                variant="outline-secondary"
                size="sm"
                class="float-right"
                @click="addDepartment"
              >
                Add
              </b-button>
            </template>
          </b-modal>
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
      showAddDepartment: false,
      departmentToAdd: '',
      departments: [],
      errors: {},
      hasNameErrors: false
    }
  },
  mounted () {
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      const { data } = await axios.get('/api/departments')
      const departments = this.departments
      data.forEach(function (dept) {
        let config
        if (typeof dept.maxDayPosition !== 'undefined') {
          config = { maxDayPosition: dept.maxDayPosition, maxSuccess: dept.maxSuccess, maxWarning: dept.maxWarning }
        }
        departments.push({ name: dept.name, config, edit: dept._id })
      })
    },
    addDepartment () {
      axios.post('/api/departments', { name: this.departmentToAdd })
        .then((resp) => {
          if (resp.status === 200) {
            this.showAddDepartment = false
            this.departmentToAdd = ''
            this.departments = []
            this.getDepartments()
          }
        }).catch((e) => {
          this.errors = e.response.data
          if (typeof this.errors.nameError !== 'undefined') {
            this.hasNameErrors = true
          }
        })
    },
    clearErrors () {
      this.errors = {}
      this.hasNameErrors = false
    }
  }
}
</script>

<style>
</style>
