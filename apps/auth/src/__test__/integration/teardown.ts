import { execSync } from 'child_process';

module.exports = async () => {
  execSync('docker-compose down');
  if (process.platform != 'linux') {
    execSync('docker volume rm e-commerce-monorepo_db');
  }
};
