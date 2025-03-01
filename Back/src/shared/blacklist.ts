const tokenBlacklist = new Set<string>();

export const addToBlacklist = (token: string, expiresIn: number) => {
  tokenBlacklist.add(token);
  setTimeout(() => tokenBlacklist.delete(token), expiresIn * 1000); // Elimina cuando expira
};

export const isBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};