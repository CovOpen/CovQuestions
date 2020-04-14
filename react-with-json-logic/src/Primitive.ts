export type Primitive = string | boolean | number;

export const isPrimitive = (value: unknown): value is Primitive => {
  return ["string", "boolean", "number"].indexOf(typeof value) > -1;
};
