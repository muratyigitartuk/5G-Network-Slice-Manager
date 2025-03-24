import { renderHook, act } from '@testing-library/react-hooks';
import useForm from '../useForm';
import { required, minLength, email } from '../formValidation';

describe('useForm Hook', () => {
  test('initializes with initial values', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    const { result } = renderHook(() => useForm(initialValues));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  test('updates values when handleChange is called', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      });
    });
    
    expect(result.current.values).toEqual({ name: 'John', email: '' });
  });

  test('updates touched fields when handleBlur is called', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name' }
      });
    });
    
    expect(result.current.touched).toEqual({ name: true });
  });

  test('validates fields based on validation rules', () => {
    const initialValues = { name: '', email: '' };
    const validationRules = {
      name: [required('Name is required')],
      email: [required('Email is required'), email('Invalid email format')]
    };
    
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    // Initially, no validation errors because no fields are touched
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(false); // But form is not valid
    
    // Touch and change the name field
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      });
      result.current.handleBlur({
        target: { name: 'name' }
      });
    });
    
    // Name field should be valid, but email is still invalid
    expect(result.current.errors.name).toBeNull();
    expect(result.current.isValid).toBe(false);
    
    // Touch and change the email field with invalid value
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'not-an-email' }
      });
      result.current.handleBlur({
        target: { name: 'email' }
      });
    });
    
    // Email field should have validation error
    expect(result.current.errors.email).toBe('Invalid email format');
    expect(result.current.isValid).toBe(false);
    
    // Change email to valid value
    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' }
      });
    });
    
    // Form should now be valid
    expect(result.current.errors.email).toBeNull();
    expect(result.current.isValid).toBe(true);
  });

  test('resets form to initial values', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    // Change values
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      });
      result.current.handleChange({
        target: { name: 'email', value: 'john@example.com' }
      });
      result.current.handleBlur({
        target: { name: 'name' }
      });
    });
    
    expect(result.current.values).toEqual({ name: 'John', email: 'john@example.com' });
    expect(result.current.touched).toEqual({ name: true });
    
    // Reset form
    act(() => {
      result.current.resetForm();
    });
    
    // Values and touched should be reset
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.touched).toEqual({});
    expect(result.current.errors).toEqual({});
  });

  test('sets all fields as touched when validateAll is called', () => {
    const initialValues = { name: '', email: '' };
    const validationRules = {
      name: [required('Name is required')],
      email: [required('Email is required')]
    };
    
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    // Initially, no fields are touched
    expect(result.current.touched).toEqual({});
    
    // Validate all fields
    act(() => {
      result.current.validateAll();
    });
    
    // All fields should be touched and have errors
    expect(result.current.touched).toEqual({ name: true, email: true });
    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Email is required'
    });
    expect(result.current.isValid).toBe(false);
  });

  test('handles form submission', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    const onSubmit = jest.fn();
    
    const { result } = renderHook(() => useForm(initialValues, {}, onSubmit));
    
    // Submit the form
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    
    // onSubmit should be called with form values
    expect(onSubmit).toHaveBeenCalledWith(initialValues);
  });

  test('does not submit if form is invalid', () => {
    const initialValues = { name: '', email: '' };
    const validationRules = {
      name: [required('Name is required')],
      email: [required('Email is required')]
    };
    const onSubmit = jest.fn();
    
    const { result } = renderHook(() => useForm(initialValues, validationRules, onSubmit));
    
    // Submit the form
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() });
    });
    
    // onSubmit should not be called
    expect(onSubmit).not.toHaveBeenCalled();
    
    // All fields should be touched and have errors
    expect(result.current.touched).toEqual({ name: true, email: true });
    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Email is required'
    });
  });

  test('updates form values with setValues', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm(initialValues));
    
    // Set new values
    act(() => {
      result.current.setValues({ name: 'John', email: 'john@example.com' });
    });
    
    expect(result.current.values).toEqual({ name: 'John', email: 'john@example.com' });
  });

  test('handles checkbox inputs correctly', () => {
    const initialValues = { name: '', subscribed: false };
    const { result } = renderHook(() => useForm(initialValues));
    
    // Change checkbox value
    act(() => {
      result.current.handleChange({
        target: { name: 'subscribed', type: 'checkbox', checked: true }
      });
    });
    
    expect(result.current.values).toEqual({ name: '', subscribed: true });
  });

  test('handles multiple validation rules per field', () => {
    const initialValues = { password: '' };
    const validationRules = {
      password: [
        required('Password is required'),
        minLength(8, 'Password must be at least 8 characters')
      ]
    };
    
    const { result } = renderHook(() => useForm(initialValues, validationRules));
    
    // Change password to short value
    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: 'short' }
      });
      result.current.handleBlur({
        target: { name: 'password' }
      });
    });
    
    // Should show minLength error
    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
    
    // Change to valid password
    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: 'validpassword' }
      });
    });
    
    // Should be valid
    expect(result.current.errors.password).toBeNull();
  });
}); 