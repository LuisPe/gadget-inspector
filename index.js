// Import external packages or modules
require("dotenv").config({ silent: true });
const path = require("path");
const { readFileAsArray } = require("./readFile");
const log = require("centralized-logger").loggerInstance;

// Init global variables
const missingVars = [];
let objectConfig = {};
let logError = "";
let logWarn = "";
let countError = 0;
let countWarn = 0;

const getEnvFromString = string => {
  return string
    .replace(/([A-Z])/g, "_$1")
    .toUpperCase()
    .trim();
};

const getEnvVars = objectConfig => {
  let keys = Object.keys(objectConfig);
  keys.map(key => {
    let envVar;
    envVar = getEnvFromString(key);
    if (!process.env.hasOwnProperty(envVar)) {
      missingVars.push({
        envName: envVar,
        defaultValue: objectConfig[key].split("||")[1]
      });
    }
  });
};

exports.inspectorGadget = async () => {
  try {
    // Get the global path
    global.appRoot = path.resolve(__dirname);
    // truncated in node_modules to get the project location
    const baseRoot = appRoot.split("node_modules");

    // We call the function readFileAsArray with the configuration (config.js) file
    const configFile = await readFileAsArray(`${baseRoot[0]}/config.js`);

    configFile.map(value => {
      let valuePosition = value.indexOf(": {");
      if (valuePosition < 0) {
        let keyPosition = value.indexOf(":");

        if (keyPosition >= 0) {
          let key = value.slice(0, keyPosition).trim();

          let realValue = value
            .slice(keyPosition + 1)
            .trim()
            .replace(",", "");
          objectConfig[key] = realValue;
        }
      }
    });

    getEnvVars(objectConfig);

    log.warn(
      ":::::: HELLO, HERE THE INSPECTOR GADGET WANTS TO TELL YOU SOME THINGS THAT HE FOUND AND MAY BE INTERESTED ::::::"
    );
    if (missingVars.length) {
      logError += `:::::: MISSING ENVIRONMENT VARIABLE(s) EMPTY VALUE :::::: `;
      logWarn += `:::::: MISSING ENVIRONMENT VARIABLE(s) DEFAULT VALUE :::::: `;
      missingVars.forEach(mv => {
        if (!mv.defaultValue) {
          countError++;
          logError += `${mv.envName} ----> Value: ${mv.defaultValue} :::: `;
        } else {
          countWarn++;
          logWarn += `${mv.envName} ----> Value: ${mv.defaultValue} :::: `;
        }
      });
      console.log(countError, countWarn);
      countError > 0 ? log.error(logError) : null;
      countWarn > 0 ? log.warn(logWarn) : null;
    } else {
      log.warn(":::::: ENVIRONMENT VARIABLES CORRECTLY CONFIGURED ::::::");
    }
  } catch (err) {
    log.error(err);
  }
};
