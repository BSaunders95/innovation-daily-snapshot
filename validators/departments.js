class DepartmentValidator {
  static validateCreateDepartment (dept) {
    const errors = { hasErrors: false, nameError: '' }
    if (dept.name.trim().length === 0) {
      errors.hasErrors = true
      errors.nameError = 'Department name must not be blank'
    } else if (!/^[a-zA-z ]*$/.test(dept.name)) {
      errors.hasErrors = true
      errors.nameError = 'Department name must only include letters and spaces'
    }
    return errors
  }

  static validateConfigureDepartment (dept) {
    const errors = { hasErrors: false, configError: '' }
    if (dept.maxWarning < dept.maxSuccess) {
      errors.hasErrors = true
      errors.configError = 'Max \'warning\' position must be greater than the max \'success\' position'
    }
    return errors
  }
}

module.exports = DepartmentValidator
