import bcrypt from 'bcryptjs';

export async function hashPin(pin: string): Promise<string> {
  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    throw new Error('PIN must be 4 digits');
  }
  return bcrypt.hash(pin, 10);
}

export async function verifyPin(providedPin: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(providedPin, storedHash);
}