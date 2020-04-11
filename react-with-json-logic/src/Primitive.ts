export type Primitive = string | boolean | number;

export const isPrimitive = (value: unknown): value is Primitive => {
  return typeof value in ["string", "boolean", "number"];
};
