/**
 * Form validation utility functions
 * 
 * This module provides common validation rules for form fields
 * and a validation function to check multiple rules at once.
 */

/**
 * Validates that a field is not empty
 * @param {string} value - The field value
 * @param {string} message - Custom error message (optional)
 * @returns {string|null} - Error message or null if valid
 */
export const required = (value, message = 'This field is required') => {
  if (!value && value !== 0) return message;
  if (typeof value === 'string' && value.trim() === '') return message;
  return null;
};

/**
 * Validates that a field has a minimum length
 * @param {number} minLength - The minimum length required
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const minLength = (minLength, message) => (value) => {
  if (!value) return null; // Let required handle empty values
  if (value.length < minLength) {
    return message || `Must be at least ${minLength} characters`;
  }
  return null;
};

/**
 * Validates that a field has a maximum length
 * @param {number} maxLength - The maximum length allowed
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const maxLength = (maxLength, message) => (value) => {
  if (!value) return null; // Let required handle empty values
  if (value.length > maxLength) {
    return message || `Must be no more than ${maxLength} characters`;
  }
  return null;
};

/**
 * Validates that a field matches a regex pattern
 * @param {RegExp} pattern - The regex pattern to match
 * @param {string} message - Error message
 * @returns {function} - Validation function
 */
export const pattern = (pattern, message) => (value) => {
  if (!value) return null; // Let required handle empty values
  if (!pattern.test(value)) {
    return message;
  }
  return null;
};

/**
 * Validates that a field is a valid email address
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const email = (message = 'Please enter a valid email address') => (value) => {
  if (!value) return null; // Let required handle empty values
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern(emailRegex, message)(value);
};

/**
 * Validates that a field is a valid URL
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const url = (message = 'Please enter a valid URL') => (value) => {
  if (!value) return null; // Let required handle empty values
  try {
    new URL(value);
    return null;
  } catch (e) {
    return message;
  }
};

/**
 * Validates that a field is a number
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const number = (message = 'Please enter a valid number') => (value) => {
  if (!value && value !== 0) return null; // Let required handle empty values
  if (isNaN(Number(value))) {
    return message;
  }
  return null;
};

/**
 * Validates that a number is within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const range = (min, max, message) => (value) => {
  if (!value && value !== 0) return null; // Let required handle empty values
  const num = Number(value);
  if (isNaN(num)) return null; // Let number validation handle this
  if (num < min || num > max) {
    return message || `Must be between ${min} and ${max}`;
  }
  return null;
};

/**
 * Validates that a field matches another field
 * @param {string} fieldToMatch - The name of the field to match
 * @param {Object} formValues - The form values object
 * @param {string} message - Custom error message (optional)
 * @returns {function} - Validation function
 */
export const matches = (fieldToMatch, formValues, message) => (value) => {
  if (!value) return null; // Let required handle empty values
  if (value !== formValues[fieldToMatch]) {
    return message || `Must match ${fieldToMatch}`;
  }
  return null;
};

/**
 * Validates a field against multiple validation rules
 * @param {string} value - The field value
 * @param {Array} validations - Array of validation functions
 * @returns {string|null} - First error message or null if all validations pass
 */
export const validate = (value, validations) => {
  for (const validation of validations) {
    const error = validation(value);
    if (error) {
      return error;
    }
  }
  return null;
};

/**
 * Validates an entire form
 * @param {Object} values - Form values
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Object with error messages for each field
 */
export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const fieldValidations = validationRules[field];
    const error = validate(values[field], fieldValidations);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

/**
 * Checks if a form has any errors
 * @param {Object} errors - Form errors object
 * @returns {boolean} - True if form has errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
}; 