import { app } from 'electron';
import jsonConfig from '../../config';

export interface IConfig {
  BUILD_TYPE: string;
  BUILD_VERSION: string;
  IS_PRODUCTION: boolean;
  IS_TEST: boolean;
  ALLOW_PRERELEASE: boolean;
  USER_DATA_PATH: string;
  CHANNEL: string;
  VERSION: string;
  LOG_LEVEL: string;
  API_CYPHEROCK: string;
}

const configValidators = {
  API_CYPHEROCK: (val?: string) => val?.startsWith('http') ?? false,
  BUILD_TYPE: (val?: string) => ['production', 'debug'].includes(val as any),
  LOG_LEVEL: (val?: string) =>
    ['error', 'warn', 'info', 'verbose', 'debug'].includes(val as any),
  BUILD_VERSION: (val?: string) => !!val,
  CHANNEL: (val?: string) => !!val,
  SIMULATE_PRODUCTION: (val?: boolean) => typeof val === 'boolean',
  ALLOW_PRERELEASE: (val?: boolean) => typeof val === 'boolean',
} as const;

const validateJsonConfig = () => {
  for (const key in configValidators) {
    if (!(configValidators as any)[key]((jsonConfig as any)[key])) {
      throw new Error(`Invalid ${key} in json config`);
    }
  }
};

const getFromExternalEnv = (key: string, defaultValue: string) => {
  const validator = (configValidators as any)[key];

  const externalVal = process.env[key];

  if (
    validator &&
    typeof externalVal !== 'undefined' &&
    validator(externalVal)
  ) {
    return externalVal;
  }

  return defaultValue;
};

/**
 * `IS_PRODUCTION`:
 * This variable is used to enable or disable certain features depending on
 * if the app is in production mode or not.
 *
 * *********** Why not just use `NODE_ENV`? ************
 * We may want to simulate production environment in development mode.
 * In such cases, we can just set the `IS_PRODUCTION` to `true`.
 *
 * ******** When to use `NODE_ENV` and when to use `IS_PRODUCTION`? *********
 * `NODE_ENV`:
 * 1. Use to differentiate between development mode and production mode.
 * 2. We may have cases where different code works on different environments,
 *    such as path of icon etc. In these cases use `NODE_ENV`
 * 3. Use this to enable production features which you don't want to be simulated.
 *    Example: Crash Report, Analytics
 *
 * `IS_PRODUCTION`:
 * 1. Use to decide if we want to enable or disable a feature.
 * 2. Example: Websockets, Refresh on Startup etc.
 */
const getConfig = (): IConfig => {
  validateJsonConfig();

  let USER_DATA_PATH: string;
  let IS_PRODUCTION: boolean;
  let VERSION: string;

  if (!app && process.env.NODE_ENV === 'test') {
    USER_DATA_PATH = '.';
    VERSION = '';
  } else {
    USER_DATA_PATH = app.getPath('userData');
    VERSION = app.getVersion();
  }

  // Treat test as a production environment
  if (
    ['production', 'test'].includes(process.env.NODE_ENV?.toLowerCase() as any)
  ) {
    IS_PRODUCTION = true;
  } else if (jsonConfig.SIMULATE_PRODUCTION) {
    IS_PRODUCTION = true;
  } else {
    IS_PRODUCTION = false;
  }

  const config = {
    BUILD_TYPE: jsonConfig.BUILD_TYPE,
    BUILD_VERSION: jsonConfig.BUILD_VERSION,
    IS_PRODUCTION,
    IS_TEST: process.env.NODE_ENV === 'test',
    ALLOW_PRERELEASE: jsonConfig.ALLOW_PRERELEASE,
    USER_DATA_PATH,
    CHANNEL: jsonConfig.CHANNEL,
    VERSION,
    // These variables can be overridden from external env
    LOG_LEVEL: getFromExternalEnv('LOG_LEVEL', jsonConfig.LOG_LEVEL),
    API_CYPHEROCK: getFromExternalEnv('API_CYPHEROCK', jsonConfig.LOG_LEVEL),
  };

  return config;
};

const updateProcessEnvWithConfig = (config: IConfig) => {
  for (const key in config) {
    if (key in config) {
      process.env[key] = (config as any)[key];
    }
  }
};

export const config = getConfig();

updateProcessEnvWithConfig(config);
