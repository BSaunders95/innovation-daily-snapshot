<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      Welcome to the daily snapshot app!
    </h1>
    <p style="padding-bottom: 20px">
      An application to track metrics of departments across Companies House.
    </p>
    <b-col>
      <b-row class="justify-content-md-center">
        <b-col lg="3">
          <b-card title="Select a department">
            <form>
              <b-alert v-model="showDepartmentError" variant="danger">
                Please select a department!
              </b-alert>
              <b-form-select v-model="department" :options="departments" class="m-md-2"></b-form-select>
            </form>
            <b-btn type="submit" variant="success" @click="go">
              Go!
            </b-btn>
          </b-card>
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
      showDepartmentError: false,
      department: '',
      departments: [
        { value: '', text: 'Select a department...' }
      ]
    }
  },
  mounted () {
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      const { data } = await axios.get('/api/departments')
      const departments = this.departments
      data.forEach(function (department) {
        departments.push({ value: department._id, text: department.name })
      })
    },
    go () {
      if (this.department === '') {
        this.showDepartmentError = true
      } else {
        this.$router.push('/dayposition/' + this.department)
      }
    }
  },
  watch: {
    'department' () {
      if (this.showDepartmentError && this.department !== '') {
        this.showDepartmentError = false
      }
    }
  }
}
</script>

<style>
</style>
