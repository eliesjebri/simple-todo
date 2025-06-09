const { version } = require('../package.json');
const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const { logInfo, logSuccess, logWarn, logError } = require('./log');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});


app.get('/version', (req, res) => {
    res.send({ version });
});


app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

const { logInfo, logSuccess, logError } = require('./log');

db.init()
    .then(() => {
        logInfo(`[DB] Using ${process.env.DB_TYPE || 'SQLite'} backend`);
        logSuccess('Database initialized successfully');
        app.listen(3000, () => logInfo('[SERVER] Listening on port 3000'));
    })
    .catch((err) => {
        logError('Failed to initialize database', err);
        process.exit(1);
    });



const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
