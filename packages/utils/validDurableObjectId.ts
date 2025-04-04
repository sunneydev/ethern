export function validDurableObjectId(str: string) {
  return /^[0-9a-fA-F]{64}$/.test(str);
}
