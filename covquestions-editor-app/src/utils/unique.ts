export function unique(array: any[]) {
  return array.filter((v, i, a) => a.indexOf(v) === i);
}
