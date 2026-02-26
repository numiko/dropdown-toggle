function deepMerge(obj1, obj2) {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (
        obj2[key] !== null &&
        typeof obj2[key] === 'object' &&
        typeof obj1[key] === 'object' &&
        obj1[key] !== null &&
        !Array.isArray(obj2[key]) &&
        !Array.isArray(obj1[key]) &&
        typeof obj2[key] !== 'function' &&
        typeof obj1[key] !== 'function'
      ) {
        result[key] = deepMerge(obj1[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }
  }

  return result;
}

export { deepMerge };
