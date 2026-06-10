export const camelToKebabCase = (camelCaseStr: string) =>
	camelCaseStr.replace(/([A-Z])/g, '-$1').toLowerCase();
