import { execSync } from 'child_process';

module.exports = async () => {
  execSync('npx nx push shop');
};
