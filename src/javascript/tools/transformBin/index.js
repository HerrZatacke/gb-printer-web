const transformBin = (data) => {
  const transformed = [];

  transformed.push('!{"command":"INIT"}\n');
  transformed.push('!{"command":"DATA","compressed":0,"more":1}\n');

  // for (let i = 0; i < 16; i += 1) {
  for (let i = 0; i < 5760; i += 1) {
    transformed.push(data[i + 8].toString(16).padStart(2, '0'));

    if (i % 16 === 15) {
      transformed.push('\n');
    } else {
      transformed.push(' ');
    }
  }

  transformed.push('!{"command":"DATA","compressed":0,"more":0}\n');
  transformed.push('!{"command":"PRNT","sheets":1,"margin_upper":1,"margin_lower":3,"pallet":228,"density":64 }\n');

  return transformed.join('');
};

export default transformBin;
