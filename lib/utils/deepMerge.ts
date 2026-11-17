type UnknownRecord = Record<string, unknown>;

/**
 * Narrow a value to a plain object that is safe to merge into.
 * Arrays, functions and `null` are treated as leaf values and
 * therefore overwrite rather than merge.
 */
function isMergeableObject(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge<T, U>(obj1: T, obj2: U): T & U {
  const source1 = (obj1 ?? {}) as UnknownRecord;
  const source2 = (obj2 ?? {}) as UnknownRecord;
  const result: UnknownRecord = { ...source1 };

  for (const key in source2) {
    if (Object.prototype.hasOwnProperty.call(source2, key)) {
      const value1 = source1[key];
      const value2 = source2[key];

      if (isMergeableObject(value1) && isMergeableObject(value2)) {
        result[key] = deepMerge(value1, value2);
      } else {
        result[key] = value2;
      }
    }
  }

  return result as T & U;
}

export { deepMerge };
