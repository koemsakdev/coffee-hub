const generateUniqueId = (prefix: string): string => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomPart}`;
};

export { generateUniqueId };