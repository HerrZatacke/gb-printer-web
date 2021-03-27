const cleanPath = (path) => (
  path
    .replace(/[^a-z0-9/\\._-]/gi, '') // remove invalid chars
    .replace(/[\\/]+/gi, '/') // replace '\' with '/'
    .replace(/^\//, '') // remove starting '/'
    .replace(/\/$/, '') // remove trailing '/'
);

export default cleanPath;
