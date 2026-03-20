/**
 * Input Validation Composable
 * - Validate and sanitize user inputs
 * - Prevent XSS and injection attacks
 */

import { 
  sanitizeHTML, 
  sanitizeURL, 
  isValidEmail, 
  isValidPhone,
  isValidAlphanumeric,
  detectAttackPattern,
  isPasswordStrong
} from './useSecurity';

export const useValidation = () => {
  const errors = ref<string[]>([]);

  const clearErrors = () => {
    errors.value = [];
  };

  const addError = (error: string) => {
    errors.value.push(error);
  };

  // Validate required field
  const validateRequired = (value: any, fieldName: string): boolean => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      addError(`${fieldName} is required`);
      return false;
    }
    return true;
  };

  // Validate email
  const validateEmail = (email: string, fieldName: string = 'Email'): boolean => {
    if (!email) return true; // Let required validation handle empty
    if (!isValidEmail(email)) {
      addError(`${fieldName} must be a valid email address`);
      return false;
    }
    return true;
  };

  // Validate phone
  const validatePhone = (phone: string, fieldName: string = 'Phone'): boolean => {
    if (!phone) return true;
    if (!isValidPhone(phone)) {
      addError(`${fieldName} must be a valid Indonesian phone number (e.g., 081234567890)`);
      return false;
    }
    return true;
  };

  // Validate username
  const validateUsername = (username: string): boolean => {
    if (!validateRequired(username, 'Username')) return false;
    if (username.length < 3) {
      addError('Username must be at least 3 characters');
      return false;
    }
    if (username.length > 50) {
      addError('Username must not exceed 50 characters');
      return false;
    }
    if (!isValidAlphanumeric(username, 3, 50)) {
      addError('Username can only contain letters, numbers, dots, and underscores');
      return false;
    }
    return true;
  };

  // Validate password
  const validatePassword = (password: string): boolean => {
    if (!validateRequired(password, 'Password')) return false;
    const strength = isPasswordStrong(password);
    if (!strength.valid) {
      strength.errors.forEach(error => addError(error));
      return false;
    }
    return true;
  };

  // Validate URL
  const validateURL = (url: string, fieldName: string = 'URL'): boolean => {
    if (!url) return true;
    const sanitized = sanitizeURL(url);
    if (!sanitized) {
      addError(`${fieldName} contains invalid protocol`);
      return false;
    }
    try {
      new URL(sanitized);
      return true;
    } catch {
      addError(`${fieldName} must be a valid URL`);
      return false;
    }
  };

  // Validate text length
  const validateLength = (
    value: string,
    fieldName: string,
    min: number,
    max: number
  ): boolean => {
    if (!value) return true;
    if (value.length < min) {
      addError(`${fieldName} must be at least ${min} characters`);
      return false;
    }
    if (value.length > max) {
      addError(`${fieldName} must not exceed ${max} characters`);
      return false;
    }
    return true;
  };

  // Validate number range
  const validateNumberRange = (
    value: number,
    fieldName: string,
    min: number,
    max: number
  ): boolean => {
    if (value < min) {
      addError(`${fieldName} must be at least ${min}`);
      return false;
    }
    if (value > max) {
      addError(`${fieldName} must not exceed ${max}`);
      return false;
    }
    return true;
  };

  // Sanitize and validate input
  const sanitizeAndValidate = (
    value: string,
    fieldName: string,
    options: {
      required?: boolean;
      maxLength?: number;
      checkAttacks?: boolean;
    } = {}
  ): { valid: boolean; value: string } => {
    const { required = true, maxLength = 1000, checkAttacks = true } = options;

    if (required && !validateRequired(value, fieldName)) {
      return { valid: false, value: '' };
    }

    if (!value) {
      return { valid: true, value: '' };
    }

    // Check for attack patterns
    if (checkAttacks) {
      const attack = detectAttackPattern(value);
      if (attack.detected) {
        addError(`${fieldName} contains invalid characters`);
        return { valid: false, value: '' };
      }
    }

    // Validate length
    if (value.length > maxLength) {
      addError(`${fieldName} must not exceed ${maxLength} characters`);
      return { valid: false, value: '' };
    }

    // Sanitize
    const sanitized = sanitizeHTML(value);

    return { valid: true, value: sanitized };
  };

  // Validate product form
  const validateProductForm = (form: any): boolean => {
    clearErrors();
    let isValid = true;

    if (!sanitizeAndValidate(form.title, 'Product Title', { maxLength: 255 }).valid) {
      isValid = false;
    }

    if (!form.price || form.price < 0) {
      addError('Price must be a positive number');
      isValid = false;
    }

    if (form.original_price && form.original_price < 0) {
      addError('Original price must be a positive number');
      isValid = false;
    }

    if (form.description) {
      const result = sanitizeAndValidate(form.description, 'Description', { 
        required: false, 
        maxLength: 2000 
      });
      if (!result.valid) {
        isValid = false;
      }
      form.description = result.value;
    }

    if (form.stock !== null && form.stock !== undefined && form.stock < 0) {
      addError('Stock must be a positive number');
      isValid = false;
    }

    return isValid;
  };

  // Validate link form
  const validateLinkForm = (form: any): boolean => {
    clearErrors();
    let isValid = true;

    if (!sanitizeAndValidate(form.title, 'Link Title', { maxLength: 100 }).valid) {
      isValid = false;
    }

    if (!validateURL(form.url, 'Link URL')) {
      isValid = false;
    } else {
      form.url = sanitizeURL(form.url);
    }

    if (form.order !== null && form.order !== undefined && form.order < 0) {
      addError('Order must be a positive number');
      isValid = false;
    }

    return isValid;
  };

  // Validate custom field
  const validateCustomField = (form: any): boolean => {
    clearErrors();
    let isValid = true;

    if (!sanitizeAndValidate(form.name, 'Field Name', { maxLength: 50, checkAttacks: true }).valid) {
      isValid = false;
    }

    if (!sanitizeAndValidate(form.label, 'Field Label', { maxLength: 100 }).valid) {
      isValid = false;
    }

    const allowedTypes = ['text', 'textarea', 'email', 'tel', 'number', 'date'];
    if (!allowedTypes.includes(form.type)) {
      addError('Invalid field type');
      isValid = false;
    }

    return isValid;
  };

  // Validate profile
  const validateProfile = (profile: any): boolean => {
    clearErrors();
    let isValid = true;

    if (!sanitizeAndValidate(profile.name, 'Name', { maxLength: 255 }).valid) {
      isValid = false;
    }

    if (profile.bio) {
      const result = sanitizeAndValidate(profile.bio, 'Bio', { 
        required: false, 
        maxLength: 500 
      });
      if (!result.valid) {
        isValid = false;
      }
      profile.bio = result.value;
    }

    if (profile.whatsapp) {
      if (!validatePhone(profile.whatsapp, 'WhatsApp')) {
        isValid = false;
      }
    }

    return isValid;
  };

  return {
    errors,
    clearErrors,
    validateRequired,
    validateEmail,
    validatePhone,
    validateUsername,
    validatePassword,
    validateURL,
    validateLength,
    validateNumberRange,
    sanitizeAndValidate,
    validateProductForm,
    validateLinkForm,
    validateCustomField,
    validateProfile,
  };
};
