const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateProfileInput = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.bio = !isEmpty(data.bio) ? data.bio : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (Validator.isEmpty(data.bio)) {
    errors.bio = 'Bio field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
