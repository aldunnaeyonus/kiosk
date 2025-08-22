/**
 * Converts various string representations of booleans into an actual boolean.
 * @param {string | null | undefined} stringValue The string to convert.
 * @returns {boolean} The boolean representation.
 */
export const stringToBoolean = (stringValue: string | null | undefined): boolean => {
  if (typeof stringValue !== 'string') {
    return false;
  }
  
  switch (stringValue.toLowerCase().trim()) {
    case "true":
    case "yes":
    case "1":
      return true;
    
    default:
      return false;
  }
};
