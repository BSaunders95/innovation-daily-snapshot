class DayPositionValidator {
  static validateSubmitDayPosition (dayPosition) {
    const errors = { hasErrors: false, dayPositionError: '' }
    if (!dayPosition.date || !dayPosition.received || !dayPosition.processed || !dayPosition.remaining || !dayPosition.dayPosition) {
      errors.hasErrors = true
      errors.dayPositionError = 'Values must not be blank'
    } else if (dayPosition.received < 0 || dayPosition.processed < 0 || dayPosition.remaining < 0 || dayPosition.dayPosition < 0) {
      errors.hasErrors = true
      errors.dayPositionError = 'Values must not be negative'
    }
    return errors
  }
}

module.exports = DayPositionValidator
