/* eslint-disable */
import type { Config } from 'jest';
const commonConfig: Config = {
  displayName: 'auth',
  preset: '../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/../../../tsconfig.spec.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/auth',
};

export default commonConfig;
