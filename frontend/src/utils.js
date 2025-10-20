export const formatUSSD = (code) => {
  if (!/^\d{12,20}$/.test(code)) {
    throw new Error('Invalid code: must be 12-20 digits');
  }
  return `*805*${code}#`;
};