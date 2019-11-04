const expressDefend = require('express-defend');
const blacklist = require('express-blacklist');

const Cabin = require('cabin');
const cabin = new Cabin();

const { Event } = require('../../db/models');
const { Op } = require('sequelize');

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp, expressApp: app, csrf } = aips;
    
    // middleware
    app.use(cabin.middleware);

    // XSS, path traversal, SQL injection  prevention
    app.use(blacklist.blockRequests('blacklist.txt'));
    app.use(expressDefend.protect({
        maxAttempts: 5,                   // (default: 5) number of attempts until "onMaxAttemptsReached" gets triggered
        dropSuspiciousRequest: true,      // respond 403 Forbidden when max attempts count is reached
        consoleLogging: true,             // (default: true) enable console logging
        logFile: 'suspicious.log',        // if specified, express-defend will log it's output here
        onMaxAttemptsReached: (ipAddress, url) => {
            console.log('IP address ' + ipAddress + ' is considered to be malicious, URL: ' + url);
        }
    }));

    // api routes
    app.use('/user', require('./user')(aips));
    app.use('/group', require('./group')(aips));
    app.use('/auth', require('./auth')(aips));
    app.use('/post', require('./post')(aips));
    app.use('/event', require('./event')(aips));

    // pages/index
    app.get('/', csrf, async(req, res) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        const events = await Event.findAll({
            where: {
                endAt: {
                    [Op.gte]: date,
                }
            }
        });

        nextApp.render(req, res, '/', {
            csrfToken: req.csrfToken(),
            events: events,
        });
    });

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }

        res.status(500).send('500 Internal Server Error');
    });

    // default catch-all to all next.js to handle all other routes
    app.all('*', (req, res) => {
        const nextRequestHandler = nextApp.getRequestHandler();
        return nextRequestHandler(req, res);
    });
};