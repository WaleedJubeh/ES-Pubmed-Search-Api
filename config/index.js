const config = require("config");

/**
 * Read configuration from environment variables/config files.
 * @param {string} key Key to configuration.
 * @returns {string | undefined} Configuration value.
 */
const read = (key) => {
  const envKey = key.replace(/\./g, "_");

  // Environment variables have precedence.
  if (process.env[envKey]) {
    return process.env[envKey];
  }

  // Otherwise fallback to config files.
  const cmd = "config." + key;
  return eval(cmd);
};

module.exports = {
  PORT: read('PORT'),
  ES_USERNAME: read('ES.USERNAME'),
  ES_PASSWORD: read('ES.PASSWORD'),
  ES_HOST: read('ES.HOST'),
  ES_PROTOCOL: read('ES.PROTOCOL')
};