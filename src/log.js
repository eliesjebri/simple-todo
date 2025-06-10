const isTTY = process.stdout.isTTY;

const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

const levels = ['debug', 'info', 'warn', 'error'];
const currentLevel = process.env.LOG_LEVEL || 'info';

function shouldLog(level) {
    return levels.indexOf(level) >= levels.indexOf(currentLevel);
}

function formatMessage(level, label, message) {
    const color = {
        debug: colors.cyan,
        info: colors.blue,
        warn: colors.yellow,
        error: colors.red,
    }[level] || colors.reset;

    const timestamp = new Date().toISOString();
    return `${color}[${timestamp}] [${label}] ${message}${colors.reset}`;
}

function log(level, label, message) {
    if (!shouldLog(level)) return;

    const formatted = formatMessage(level, label, message);
    console.log(formatted);
}

// Exported log functions
module.exports = {
    logDebug: (label, msg) => log('debug', label, msg),
    logInfo: (label, msg) => log('info', label, msg),
    logWarn: (label, msg) => log('warn', label, msg),
    logError: (label, msg) => log('error', label, msg),
};
