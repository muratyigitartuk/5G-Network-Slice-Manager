import { useState, useCallback, useEffect } from 'react';
import { validateForm, hasErrors } from './formValidation';

/**
 * Custom hook for form handling with validation
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Function} onSubmit - Function to call on form submission
 * @param {Object} options - Additional options
 * @param {boolean} options.validateOnChange - Whether to validate on change (default: false)
 * @param {boolean} options.validateOnBlur - Whether to validate on blur (default: true)
 * @param {boolean} options.validateOnSubmit - Whether to validate on submit (default: true)
 * @returns {Object} - Form handling utilities
 */
const useForm = (
  initialValues = {},
  validationRules = {},
  onSubmit = () => {},
  options = {}
) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(!hasErrors(validateForm(initialValues, validationRules)));

  // Update form validity when values or errors change
  useEffect(() => {
    setIsValid(!hasErrors(errors));
  }, [errors]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  // Validate a specific field
  const validateField = useCallback((name, value) => {
    if (!validationRules[name]) return null;
    
    const fieldErrors = validateForm({ [name]: value }, { [name]: validationRules[name] });
    return fieldErrors[name] || null;
  }, [validationRules]);

  // Validate all fields
  const validateAllFields = useCallback(() => {
    const formErrors = validateForm(values, validationRules);
    setErrors(formErrors);
    return formErrors;
  }, [values, validationRules]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    if (validateOnChange) {
      const fieldError = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [validateOnChange, validateField]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    if (validateOnBlur) {
      const fieldError = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [validateOnBlur, validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields if validateOnSubmit is true
    let formErrors = {};
    if (validateOnSubmit) {
      formErrors = validateAllFields();
      setErrors(formErrors);
    }
    
    // If there are no errors, call onSubmit
    if (!hasErrors(formErrors)) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [validateOnSubmit, validateAllFields, onSubmit, values, validationRules]);

  // Get field props
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: !!errors[name] && touched[name],
      helperText: (touched[name] && errors[name]) || ''
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    validateField,
    validateAllFields,
    getFieldProps
  };
};

// Export both named and default export
export { useForm };
export default useForm; 