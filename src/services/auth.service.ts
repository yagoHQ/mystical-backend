import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const verifyPassword = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  console.log('plain', plain);
  console.log('hashed', hashed);
  return bcrypt.compare(plain, hashed);
};
