/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string = 'Field'): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} tidak boleh kosong`
    };
  }
  return { isValid: true };
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email tidak boleh kosong'
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Format email tidak valid'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate phone number (Indonesian)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Nomor telepon tidak boleh kosong'
    };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (!/^(08|62)\d{9,11}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Nomor telepon tidak valid (harus dimulai dengan 08 atau 62)'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string, minLength: number = 6): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password tidak boleh kosong'
    };
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password minimal ${minLength} karakter`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate password match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Password tidak cocok'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate username
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Username tidak boleh kosong'
    };
  }
  
  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Username minimal 3 karakter'
    };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      error: 'Username hanya boleh huruf, angka, dan underscore'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate number
 */
export function validateNumber(value: string, fieldName: string = 'Nilai'): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} tidak boleh kosong`
    };
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} harus berupa angka`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: string, fieldName: string = 'Nilai'): ValidationResult {
  const numberCheck = validateNumber(value, fieldName);
  if (!numberCheck.isValid) return numberCheck;
  
  const num = parseFloat(value);
  if (num <= 0) {
    return {
      isValid: false,
      error: `${fieldName} harus lebih besar dari 0`
    };
  }
  
  return { isValid: true };
}

/**
 * Validate room number format
 */
export function validateRoomNumber(room: string): ValidationResult {
  if (!room || room.trim() === '') {
    return {
      isValid: false,
      error: 'Nomor kamar tidak boleh kosong'
    };
  }
  
  if (!/^[A-Z0-9]+$/i.test(room)) {
    return {
      isValid: false,
      error: 'Nomor kamar hanya boleh huruf dan angka'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate invite code
 */
export function validateInviteCode(code: string): ValidationResult {
  if (!code || code.trim() === '') {
    return {
      isValid: false,
      error: 'Kode undangan tidak boleh kosong'
    };
  }
  
  if (code.length !== 6) {
    return {
      isValid: false,
      error: 'Kode undangan harus 6 karakter'
    };
  }
  
  if (!/^[A-Z0-9]+$/.test(code)) {
    return {
      isValid: false,
      error: 'Kode undangan hanya boleh huruf kapital dan angka'
    };
  }
  
  return { isValid: true };
}

/**
 * Validate multiple fields
 */
export function validateFields(fields: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  for (const [fieldName, value] of Object.entries(fields)) {
    const rule = rules[fieldName];
    if (rule) {
      const result = rule(value);
      if (!result.isValid) {
        errors[fieldName] = result.error || 'Invalid value';
        isValid = false;
      }
    }
  }
  
  return { isValid, errors };
}
