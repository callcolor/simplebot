export const fullNameToLegacyName = (fullName?: string): string => {
  return fullName?.replace(/ Resident$/, '') ?? '';
};
