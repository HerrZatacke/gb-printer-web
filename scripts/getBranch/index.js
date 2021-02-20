const { execSync } = require('child_process');

module.exports = () => {
  try {
    return execSync('git branch --show-current').toString('ascii').trim();
  } catch (error) {
    return 'n/a';
  }
};
