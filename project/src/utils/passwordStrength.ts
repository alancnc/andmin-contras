import * as CryptoJS from 'crypto-js';

export interface PasswordAnalysis {
  score: number; // 0-100
  strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  issues: string[];
  isCompromised?: boolean;
}

export async function analyzePassword(password: string): Promise<PasswordAnalysis> {
  const issues: string[] = [];
  let score = 100;

  // Check length
  if (password.length < 8) {
    issues.push('Password is too short');
    score -= 30;
  }

  // Check complexity
  if (!/[A-Z]/.test(password)) {
    issues.push('Missing uppercase letters');
    score -= 10;
  }
  if (!/[a-z]/.test(password)) {
    issues.push('Missing lowercase letters');
    score -= 10;
  }
  if (!/[0-9]/.test(password)) {
    issues.push('Missing numbers');
    score -= 10;
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    issues.push('Missing special characters');
    score -= 10;
  }

  // Check for common patterns
  if (/^123|password|admin|qwerty/i.test(password)) {
    issues.push('Contains common patterns');
    score -= 20;
  }

  // Check if password has been compromised
  const isCompromised = await checkHaveIBeenPwned(password);
  if (isCompromised) {
    issues.push('Password has been compromised in data breaches');
    score -= 50;
  }

  // Determine strength
  let strength: 'weak' | 'moderate' | 'strong' | 'very-strong';
  if (score < 50) strength = 'weak';
  else if (score < 70) strength = 'moderate';
  else if (score < 90) strength = 'strong';
  else strength = 'very-strong';

  return {
    score: Math.max(0, score),
    strength,
    issues,
    isCompromised
  };
}

async function checkHaveIBeenPwned(password: string): Promise<boolean> {
  try {
    // Generate SHA-1 hash of the password
    const hash = CryptoJS.SHA1(password).toString().toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Query the API with the first 5 characters of the hash
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    // Check if the remainder of our hash exists in the response
    return data.split('\n').some(line => line.split(':')[0] === suffix);
  } catch (error) {
    console.error('Error checking HaveIBeenPwned:', error);
    return false;
  }
}