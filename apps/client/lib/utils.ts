export function checkIfPathStartsWith(path: string, subpaths: string[]) {
  return subpaths.some((subpath) => path.startsWith(subpath));
}
