<template>
  <div class="container-fluid mt-4">
    <h1 class="h1" style="padding-bottom: 40px">
      Feedback
    </h1>
    <p>If you have any feedback on this service, or any suggestions for improvements, please submit it here!</p>
    <b-row class="justify-content-md-center">
      <b-col lg="6">
        <b-alert v-model="hasFeedbackErrors" variant="danger">
          {{ errors.feedbackError }}
        </b-alert>
        <b-form-textarea v-model="feedback.comment" rows="6" placeholder="Feedback..."></b-form-textarea>
        <b-btn variant="success" @click="submitFeedback" style="margin-top: 10px;">
          Submit!
        </b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      feedback: {
        comment: '',
        user: this.$auth.$state.user._id
      },
      errors: {},
      hasFeedbackErrors: false
    }
  },
  methods: {
    submitFeedback () {
      this.errors = {}
      this.hasFeedbackErrors = false
      const self = this
      axios.post('/api/feedback', this.feedback).then(function (response) {
        self.$bvToast.toast('Thank you for your feedback! You will be redirected shortly', {
          toaster: 'b-toaster-top-center',
          variant: 'success',
          solid: true,
          noCloseButton: true,
          autoHideDelay: 1500
        })
        setTimeout (function() {
          self.$router.push('/')
        }, 1500);
      }).catch((e) => {
        this.errors = e.response.data
        if (typeof this.errors.feedbackError !== 'undefined') {
          this.hasFeedbackErrors = true
        }
      })
    }
  }
}
</script>
