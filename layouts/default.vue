<template>
  <div id="app">
    <b-navbar toggleable type="dark" variant="dark">
      <b-navbar-brand href="/">
        Daily Snapshot
      </b-navbar-brand>
      <b-nav>
        <b-nav-item v-if="$auth.$state.loggedIn && $auth.$state.user.superUser" link-classes="navbar-text" href="/departments">
          Departments
        </b-nav-item>
        <b-nav-item v-if="$auth.$state.loggedIn && $auth.$state.user.superUser" link-classes="navbar-text" href="/users">
          Users
        </b-nav-item>
        <b-nav-item v-if="$auth.$state.loggedIn && !$auth.$state.user.superUser" link-classes="navbar-text" href="/feedback">
          Feedback
        </b-nav-item>
      </b-nav>
      <b-navbar-nav style="flex-grow: 6; align-items: flex-end">
        <b-nav-form>
          <b-col>
            <b-nav-text>
              {{ $auth.$state.loggedIn ? 'Logged in as: \'' + $auth.$state.user.name + '\'' : '' }}
            </b-nav-text>
          </b-col>
          <b-btn @click="handleSignInOrOut" variant="outline-secondary">
            {{ $auth.$state.loggedIn ? 'Log out' : 'Log in' }}
          </b-btn>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
    <main>
      <nuxt />
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    handleSignInOrOut () {
      if (this.$auth.$state.loggedIn) {
        this.$auth.logout()
        this.$router.push('/')
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>
  body {
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  main {
    text-align: center;
    margin-top: 40px;
  }

  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495E;
    color: #ffffff;
  }

  header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }
</style>
