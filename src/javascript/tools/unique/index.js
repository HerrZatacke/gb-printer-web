const unique = (arr) => (
  arr.filter((item, index) => (
    arr.findIndex((findTag) => findTag === item) === index
  ))
);

export default unique;
