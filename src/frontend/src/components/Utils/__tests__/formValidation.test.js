import { 
  required, 
  minLength, 
  maxLength, 
  email, 
  pattern, 
  number, 
  range, 
  matches, 
  validate, 
  validateForm, 
  hasErrors 
} from '../formValidation';

describe('Form Validation Utilities', () => {
  // Test required validation
  describe('required', () => {
    test('returns error message for empty values', () => {
      expect(required('')).toBe('This field is required');
      expect(required(null)).toBe('This field is required');
      expect(required(undefined)).toBe('This field is required');
      expect(required('   ')).toBe('This field is required');
    });
    
    test('returns null for valid values', () => {
      expect(required('test')).toBeNull();
      expect(required(0)).toBeNull();
      expect(required(false)).toBeNull();
      expect(required([])).toBeNull();
    });
    
    test('accepts custom error message', () => {
      const customMessage = 'Please fill this field';
      expect(required('', customMessage)).toBe(customMessage);
    });
  });
  
  // Test minLength validation
  describe('minLength', () => {
    test('returns error message for values shorter than minimum length', () => {
      const validator = minLength(5);
      expect(validator('test')).toBe('Must be at least 5 characters');
    });
    
    test('returns null for values with sufficient length', () => {
      const validator = minLength(5);
      expect(validator('testing')).toBeNull();
      expect(validator('12345')).toBeNull();
    });
    
    test('returns null for empty values (handled by required)', () => {
      const validator = minLength(5);
      expect(validator('')).toBeNull();
      expect(validator(null)).toBeNull();
      expect(validator(undefined)).toBeNull();
    });
    
    test('accepts custom error message', () => {
      const customMessage = 'Too short';
      const validator = minLength(5, customMessage);
      expect(validator('test')).toBe(customMessage);
    });
  });
  
  // Test maxLength validation
  describe('maxLength', () => {
    test('returns error message for values longer than maximum length', () => {
      const validator = maxLength(5);
      expect(validator('testing')).toBe('Must be no more than 5 characters');
    });
    
    test('returns null for values with acceptable length', () => {
      const validator = maxLength(5);
      expect(validator('test')).toBeNull();
      expect(validator('12345')).toBeNull();
    });
    
    test('returns null for empty values (handled by required)', () => {
      const validator = maxLength(5);
      expect(validator('')).toBeNull();
      expect(validator(null)).toBeNull();
      expect(validator(undefined)).toBeNull();
    });
  });
  
  // Test email validation
  describe('email', () => {
    test('returns error message for invalid email addresses', () => {
      const validator = email();
      expect(validator('test')).toBeTruthy();
      expect(validator('test@')).toBeTruthy();
      expect(validator('test@example')).toBeTruthy();
      expect(validator('@example.com')).toBeTruthy();
    });
    
    test('returns null for valid email addresses', () => {
      const validator = email();
      expect(validator('test@example.com')).toBeNull();
      expect(validator('user.name+tag@example.co.uk')).toBeNull();
    });
  });
  
  // Test number validation
  describe('number', () => {
    test('returns error message for non-numeric values', () => {
      const validator = number();
      expect(validator('test')).toBeTruthy();
      expect(validator('123abc')).toBeTruthy();
    });
    
    test('returns null for numeric values', () => {
      const validator = number();
      expect(validator('123')).toBeNull();
      expect(validator('-123.45')).toBeNull();
      expect(validator(123)).toBeNull();
      expect(validator(0)).toBeNull();
    });
  });
  
  // Test range validation
  describe('range', () => {
    test('returns error message for values outside the range', () => {
      const validator = range(5, 10);
      expect(validator(4)).toBeTruthy();
      expect(validator(11)).toBeTruthy();
    });
    
    test('returns null for values within the range', () => {
      const validator = range(5, 10);
      expect(validator(5)).toBeNull();
      expect(validator(7)).toBeNull();
      expect(validator(10)).toBeNull();
    });
  });
  
  // Test matches validation
  describe('matches', () => {
    test('returns error message for values that do not match', () => {
      const formValues = { password: 'secret' };
      const validator = matches('password', formValues);
      expect(validator('different')).toBeTruthy();
    });
    
    test('returns null for values that match', () => {
      const formValues = { password: 'secret' };
      const validator = matches('password', formValues);
      expect(validator('secret')).toBeNull();
    });
  });
  
  // Test validate function
  describe('validate', () => {
    test('returns first error from validation rules', () => {
      const validations = [
        required,
        minLength(5)
      ];
      
      expect(validate('', validations)).toBe('This field is required');
      expect(validate('test', validations)).toBe('Must be at least 5 characters');
    });
    
    test('returns null if all validations pass', () => {
      const validations = [
        required,
        minLength(5)
      ];
      
      expect(validate('testing', validations)).toBeNull();
    });
  });
  
  // Test validateForm function
  describe('validateForm', () => {
    test('validates multiple fields and returns errors', () => {
      const values = {
        name: '',
        email: 'invalid',
        age: '30'
      };
      
      const validationRules = {
        name: [required],
        email: [required, email()],
        age: [required, number()]
      };
      
      const errors = validateForm(values, validationRules);
      
      expect(errors.name).toBe('This field is required');
      expect(errors.email).toBeTruthy();
      expect(errors.age).toBeUndefined();
    });
  });
  
  // Test hasErrors function
  describe('hasErrors', () => {
    test('returns true if errors object has properties', () => {
      const errors = { name: 'Required', email: 'Invalid' };
      expect(hasErrors(errors)).toBe(true);
    });
    
    test('returns false if errors object is empty', () => {
      const errors = {};
      expect(hasErrors(errors)).toBe(false);
    });
  });
}); 