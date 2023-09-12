import type { Config } from "jest";
import commonConfig from "../../../jest.config";

const config: Config = {
  ...commonConfig,
  globalSetup: "./setup.ts",
  globalTeardown: "./teardown.ts",
};

export default config;
