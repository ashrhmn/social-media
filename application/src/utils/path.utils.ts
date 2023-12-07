export const appPath = (path = "/") => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH;
  return base ? `${base}${path}` : path;
};
