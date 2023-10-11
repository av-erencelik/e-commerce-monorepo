import type { Config } from 'jest';
import commonConfig from '../../../jest.config';

const config: Config = {
  ...commonConfig,
  globalSetup: './setup.ts',
  globalTeardown: './teardown.ts',
  testTimeout: 10000,
};

export default config;
