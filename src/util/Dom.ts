import { camelToKebabCase } from './String';

export const convertStyleObjectToString = (styleObject: Object) =>
  Object.entries(styleObject)
    .map(([key, value]) => {
      const cssKey = camelToKebabCase(key);
      return `${cssKey}: ${value}`;
    })
    .join('; ');
