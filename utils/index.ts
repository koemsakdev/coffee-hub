const generateUniqueId = (prefix: string): string => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomPart}`;
};

const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error("Invalid JWT token format");
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

    return payload;
  } catch {
    return null
  }
}

export { generateUniqueId, decodeJWT };