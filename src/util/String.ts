/**
 * Converts a camel case string into a kebab case one.
 * e.g.
 * fieldName -> field-name
 */
export const camelToKebabCase = (camelCaseStr: string) =>
  camelCaseStr.replace(/([A-Z])/g, '-$1').toLowerCase();
