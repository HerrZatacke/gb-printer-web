const { execSync } = require('child_process');

module.exports = () => {
  try {
    return execSync('git branch')
      .toString('ascii')
      .split('*')
      .pop()
      .trim();
  } catch (error) {
    return 'n/a';
  }
};
