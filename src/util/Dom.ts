import { camelToKebabCase } from './String';

/**
 * Converts an object of css properties and values to a style string for use in html.
 */
export const convertStyleObjectToString = (styleObject: object) =>
  Object.entries(styleObject)
    .map(([key, value]) => {
      const cssKey = camelToKebabCase(key);
      return `${cssKey}: ${value}`;
    })
    .join('; ');
