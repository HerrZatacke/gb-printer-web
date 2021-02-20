const { execSync } = require('child_process');

module.exports = () => {
  try {
    return execSync('git branch')
      .toString('ascii')
      .match(/[a-z0-9/ ]+/)[0]
      .trim();
  } catch (error) {
    return 'n/a';
  }
};
