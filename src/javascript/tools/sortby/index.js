const sortBy = (key, direction = 'asc') => (arr) => {

  const dir = direction === 'desc' ? -1 : 1;

  return (
    arr.sort((a, b) => {
      if (a[key] > b[key]) {
        return dir;
      }

      if (a[key] < b[key]) {
        return -dir;
      }

      return 0;
    })
  );
};

export default sortBy;
