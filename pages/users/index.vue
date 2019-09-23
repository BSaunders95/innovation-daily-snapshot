<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      Users
    </h1>
    <p>
      Please see below a list of users and their administrative roles
    </p>
    <b-col>
      <b-row class="justify-content-md-center">
        <b-col col sm="4">
          <b-table :items="users">
            <template v-slot:cell(authroles)="row">
              <div v-if="row.item.authRoles.length > 0">
                <p v-for="(authRole, index) in row.item.authRoles" :key="`authRole-${index}`">
                  <span>
                    {{ authRole.name }}
                  </span>
                </p>
              </div>
              <div v-else>
                <span style="opacity: 0.5">
                  <i>
                    None
                  </i>
                </span>
              </div>
            </template>
            <template v-slot:cell(superUser)="row">
              <span>{{ row.item.superUser ? '&check;' : '&cross;' }}</span>
            </template>
            <template v-slot:cell(edit)="row">
              <a :href="'/users/' + row.item.edit">
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
          <b-btn pill variant="outline-secondary" @click="showAddUser = true">
            +
          </b-btn>
          <b-modal v-model="showAddUser" title="Add Department" header-bg-variant="secondary" @hide="clearErrors">
            <b-alert v-model="hasNameErrors" variant="danger">
              {{ errors.nameError }}
            </b-alert>
            <b-form-input v-model="userToAdd" placeholder="Name" style="margin-bottom: 16px"></b-form-input>
            <b-alert v-model="hasPasswordErrors" variant="danger">
              {{ errors.passwordError }}
            </b-alert>
            <b-form-input v-model="passwordToAdd" placeholder="Password"></b-form-input>
            <template v-slot:modal-footer>
              <b-button
                variant="outline-secondary"
                size="sm"
                class="float-right"
                @click="addUser"
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
      showAddUser: false,
      userToAdd: '',
      passwordToAdd: '',
      users: [],
      departments: [],
      errors: {},
      hasNameErrors: false,
      hasPasswordErrors: false
    }
  },
  mounted () {
    this.getUsers()
  },
  methods: {
    async getUsers () {
      const departments = []
      const self = this
      await axios.get('/api/departments').then(function (response) {
        response.data.forEach((department) => {
          departments.push(department)
        })
        return axios.get('/api/users')
      }).then(function (response) {
        response.data.forEach(function (user) {
          self.users.push({ name: user.name, authRoles: self.formatAuthRoles(user.authRoles, departments), superUser: user.superUser, edit: user._id })
        })
      })
    },
    addUser () {
      this.clearErrors()
      axios.post('/api/users', { name: this.userToAdd, password: this.passwordToAdd, authRoles: [] })
        .then((resp) => {
          if (resp.status === 200) {
            this.showAddUser = false
            this.userToAdd = ''
            this.passwordToAdd = ''
            this.users = []
            this.getUsers()
          }
        }).catch((e) => {
          this.errors = e.response.data
          if (typeof this.errors.nameError !== 'undefined') {
            this.hasNameErrors = true
          }
          if (typeof this.errors.passwordError !== 'undefined') {
            this.hasPasswordErrors = true
          }
        })
    },
    clearErrors () {
      this.errors = {}
      this.hasNameErrors = false
      this.hasPasswordErrors = false
    },
    formatAuthRoles (authRoles, departments) {
      const authRolesFormatted = []
      authRoles.forEach((authRole) => {
        departments.forEach((department) => {
          if (authRole === department._id) {
            authRolesFormatted.push(department)
          }
        })
      })
      return authRolesFormatted
    }
  }
}
</script>

<style>
</style>
