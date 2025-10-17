import bcrypt from 'bcrypt';

export async function verifyPinHash(providedPin: string, storedHash: string): Promise<boolean> {
  if (!providedPin || !storedHash) return false;
  return bcrypt.compare(providedPin, storedHash);
}