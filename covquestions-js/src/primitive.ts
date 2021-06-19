export type Primitive = string | boolean | number;

export const isPrimitive = (value: unknown): value is Primitive => {
  return ["string", "boolean", "number"].indexOf(typeof value) > -1;
};

export function convertToPrimitiveArray(value?: Primitive | Array<Primitive>): Array<Primitive> {
  if (value === undefined) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}
