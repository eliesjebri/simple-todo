// src/log.js

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
};

function timestamp() {
    return new Date().toISOString();
}

function logInfo(message) {
    console.log(`${colors.cyan}[INFO] ${timestamp()}${colors.reset} ${message}`);
}

function logSuccess(message) {
    console.log(`${colors.green}[OK]   ${timestamp()}${colors.reset} ${message}`);
}

function logWarn(message) {
    console.warn(`${colors.yellow}[WARN] ${timestamp()}${colors.reset} ${message}`);
}

function logError(message, err = '') {
    console.error(`${colors.red}[ERR]  ${timestamp()}${colors.reset} ${message}`);
    if (err) console.error(err);
}

module.exports = {
    logInfo,
    logSuccess,
    logWarn,
    logError,
};
