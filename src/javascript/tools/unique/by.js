const uniqueBy = (key) => (arr) => (
  arr.filter((item, index) => (
    arr.findIndex((find) => find[key] === item[key]) === index
  ))
);

export default uniqueBy;
