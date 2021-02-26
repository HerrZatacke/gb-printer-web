const { execSync } = require('child_process');

module.exports = () => {
  try {
    return execSync('git branch')
      .toString('ascii')
      .split('\n')
      .filter(Boolean)
      .filter((line) => line.trim().startsWith('*'))[0]
      .match(/[a-z0-9/ ]+/)[0]
      .trim();
  } catch (error) {
    return 'n/a';
  }
};
