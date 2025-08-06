export function getEnumValues<T>(enumType: Object) {
  return Object.values(enumType) as T[];
}
