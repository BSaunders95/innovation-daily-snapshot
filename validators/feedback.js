class FeedbackValidator {
  static validateSubmitFeedback (feedback) {
    const errors = { hasErrors: false, feedbackError: '' }
    if (typeof feedback.comment === 'undefined' || feedback.comment.trim().length === 0) {
      errors.hasErrors = true
      errors.feedbackError = 'Feedback must not be blank'
    }
    return errors
  }
}

module.exports = FeedbackValidator
