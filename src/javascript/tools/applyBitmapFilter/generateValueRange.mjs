const generateValueRange = (start, end) => {
  const step = (end - start) / 16;
  return (new Array(16))
    .fill(null)
    .map((_, index) => (
      Math.floor(start + (step * index))
    ));
};

export default generateValueRange;
