<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      <span v-text="user.name"></span>
    </h1>
    <b-col>
      <b-row class="justify-content-md-center">
        <b-col lg="3">
          <b-alert v-model="hasPasswordErrors" variant="danger">
            {{ errors.passwordError }}
          </b-alert>
          <b-card title="Auth Roles">
            <form>
              <div v-for="role in departments" :key="role.id" style="text-align: left !important;">
                <b-form-checkbox v-model="user.authRoles" size="lg" :value="role.id">{{ role.name }}</b-form-checkbox>
              </div>
            </form>
          </b-card>
          <b-card title="Super User">
            <form>
              <div>
                <b-form-checkbox v-model="user.superUser" size="lg" :value="true" switch></b-form-checkbox>
              </div>
            </form>
          </b-card>
          <b-input-group class="mt-3">
            <b-form-input v-model="user.password" :type="showPassword ? 'text' : 'password'" :readonly="readOnly"></b-form-input>
            <b-input-group-append>
              <b-button @click="showPassword ? showPassword = false : showPassword = true">
                <img src="../../static/eye.png" height="24px" width="24px"/>
              </b-button>
              <b-button variant="info" @click="changeShowChangePassword">
                Change
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-modal v-model="showChangePassword" title="Change password" header-bg-variant="secondary" ok-only>
            <b-input-group>
              <b-form-input v-model="user.password"></b-form-input>
            </b-input-group>
          </b-modal>
        </b-col>
      </b-row>
    </b-col>
    <b-col style="padding-top: 10px">
      <b-row class="justify-content-md-center">
        <b-btn variant="success" @click="saveConfig">
          Save!
        </b-btn>
      </b-row>
    </b-col>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      user: {
        name: '',
        authRoles: [],
        password: '',
        superUser: false
      },
      departments: [],
      showPassword: false,
      showChangePassword: false,
      readOnly: true,
      errors: {},
      hasPasswordErrors: false
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    async getUser () {
      const self = this
      await axios.get('/api/departments').then(function (response) {
        response.data.forEach((department) => {
          self.departments.push({ id: department._id, name: department.name })
        })
        return axios.get('/api/users/' + self.$route.params.id)
      }).then(function (response) {
        self.user.name = response.data.name
        self.user.password = response.data.password
        self.user.superUser = (typeof response.data.superUser === 'undefined') ? false : response.data.superUser
        if (typeof response.data.authRoles !== 'undefined') {
          self.user.authRoles = response.data.authRoles
        }
      })
    },
    saveConfig () {
      axios.put('/api/users/' + this.$route.params.id, this.user)
        .then((resp) => {
          if (resp.status === 204) {
            window.location.href = '/users'
          }
        }).catch((e) => {
          this.errors = e.response.data
          if (typeof this.errors.passwordError !== 'undefined') {
            this.hasPasswordErrors = true
          }
        })
    },
    changeShowChangePassword () {
      this.errors = {}
      this.hasPasswordErrors = false
      this.showChangePassword = true
    }
  }
}
</script>

<style>
</style>
