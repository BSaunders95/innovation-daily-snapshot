class UserValidator {
  static validateCreateUser (user) {
    const errors = { hasErrors: false }
    if (user.name.trim().length === 0) {
      errors.hasErrors = true
      errors.nameError = 'Name must not be blank'
    } else if (!/^[a-zA-Z]+ [a-zA-Z]+$/.test(user.name)) {
      errors.hasErrors = true
      errors.nameError = 'Name must be of the format \'Firstname Surname\''
    }

    if (!/^(?=.*\d).{4,10}$/.test(user.password)) {
      errors.hasErrors = true
      errors.passwordError = 'Password must be between 4 and 10 characters and include at least one number'
    }
    return errors
  }

  static validateUpdateUser (user) {
    const errors = { hasErrors: false }
    if (!/^(?=.*\d).{4,10}$/.test(user.password)) {
      errors.hasErrors = true
      errors.passwordError = 'Password must be between 4 and 10 characters and include at least one number'
    }
    return errors
  }
}

module.exports = UserValidator
