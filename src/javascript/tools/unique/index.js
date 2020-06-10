const uniqe = (arr) => (
  arr.filter((item, index) => (
    arr.findIndex((findTag) => findTag === item) === index
  ))
);

export default uniqe;
