require('dotenv').config();
const { version } = require('../package.json');
const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const { logInfo, logSuccess, logWarn, logError } = require('./log');

const PORT = process.env.PORT || 3000;
const appVersion = process.env.APP_VERSION || version;

app.use(express.json());
app.use(express.static(__dirname + '/static'));

// Middleware de logging des requêtes HTTP
app.use((req, res, next) => {
    logInfo('REQUEST', `${req.method} ${req.originalUrl}`);
    next();
});

// Endpoint pour version
app.get('/version', (req, res) => {
    res.send({ version: appVersion });
});

// Routes principales
app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

// Démarrage + logs
db.init()
    .then(() => {
        logInfo('DB', `Using ${process.env.DB_TYPE || 'SQLite'} backend`);
        logSuccess('DB', 'Database initialized successfully');
        app.listen(PORT, () => logInfo('SERVER', `Listening on port ${PORT}`));
    })
    .catch((err) => {
        logError('INIT', 'Failed to initialize database');
        logError('INIT', err.message || err);
        process.exit(1);
    });

// Gestion propre du shutdown
const gracefulShutdown = () => {
    logWarn('SERVER', 'Shutting down gracefully...');
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // nodemon


// logInfo('TEST', 'Logging system is working');