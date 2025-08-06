import {isPrimitive} from './common';

export const removeUndefinedProps = <T>(obj: T): T => {
  if (isPrimitive(obj)) {
    return obj;
  } else {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const newObj = { ...obj };
    Object.keys(obj as any).forEach(key => {
      if ((obj as any)[key] === undefined) {
        delete (newObj as any)[key];
      }
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return newObj;
  }
};
