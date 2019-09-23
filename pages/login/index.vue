<template>
  <div class="container-fluid mt-4">
    <b-row class="justify-content-md-center">
      <b-col lg="3">
        <b-card title="Login">
          <form>
            <b-alert v-model="userNotFound" variant="danger">
              Your username or password appears to be incorrect, please try again
            </b-alert>
            <b-form-group label="Username">
              <b-form-input v-model="username"></b-form-input>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input v-model="password"></b-form-input>
            </b-form-group>
            <div>
              <b-btn variant="success" v-on:click="login">
                Login!
              </b-btn>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      username: '',
      password: '',
      userNotFound: false
    }
  },
  watch: {},
  mounted () {},
  created () {
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    async login () {
      this.userNotFound = false
      const self = this
      await this.$auth.loginWith('local', {
        data: {
          'username': this.username,
          'password': this.password
        }
      }).catch((e) => {
        if (e.response.status === 404) {
          self.userNotFound = true
        }
      })
    }
  }
}
</script>
