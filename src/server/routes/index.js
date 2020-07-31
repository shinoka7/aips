const expressDefend = require('express-defend');
const blacklist = require('express-blacklist');

// https://github.com/cabinjs/cabin/issues/130#issuecomment-569029006
// https://github.com/ladjs/lad.sh/blob/066427cffe9f6538ff4c97b90e762840b299008e/assets/js/logger.js#L8
const Cabin = require('cabin');
const cabin = new Cabin({ 
    axe: {
        capture: false,
        silent: process.env.NODE_ENV === 'production'
    }
});

const { Event, Group, User } = require('../../db/models');
const { Op } = require('sequelize');
const fs = require('fs');

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
        title: "AIPS API",
        version: "1.0.0",
        description:
            "API for the AIPS web app, An Intuitive Platform for Societies",
        license: {
            name: "MIT",
            url: "https://choosealicense.com/licenses/mit/"
        },
        contact: {
            name: "AIPS Development Team",
            url: "https://github.com/shinoka7/aips",
            email: "rpiaips@gmail.com"
        }
        },
        servers: [
        {
            url: "https://aips.cs.rpi.edu/"
        }
        ]
    },
    apis: ["./src/server/routes/user.js"]
    };
  const specs = swaggerJsdoc(options);

const logger = require('../../services/logger');

module.exports = (aips) => {
    const middlewares = require('../middlewares')(aips);
    const { nextApp, expressApp: app, csrf } = aips;
    
    // middleware
    app.use(cabin.middleware);

    app.use("/docs", swaggerUi.serve);
    app.get(
        "/docs",
        swaggerUi.setup(specs, {
        explorer: true
        })
    );

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
        const userId = req.session.user ? req.session.user.id : 0;
        const user = await User.findByPk(userId);

        // will only contain events that are old 3 months ago and on
        const date = new Date();
        date.setMonth(date.getMonth() - 3);
        const events = await Event.findAll({
            where: {
                startDate: {
                    [Op.gte]: date,
                }
            },
            include: [{
                model: Group,
            }],
        });

        // will only contain events day 0 to 7 (From current day)
        const yesterday = new Date();
        const nextWeek = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const shownEvents = await Event.findAll({
            where: {
                [Op.or]: {
                    startDate: {
                        [Op.between]: [yesterday, nextWeek],
                    },
                    endDate: {
                        [Op.between]: [yesterday, nextWeek],
                    },
                }
            },
            include: [{
                model: Group,
            }],
        })

        const images = [];
        fs.readdir('./resources/img/buildings', (err, files) => {
            if (err) {
                return logger.info('Unable to scan directory:' + err);
            }
            files.forEach((file) => {
                images.push(file);
            })
        });

        nextApp.render(req, res, '/', {
            csrfToken: req.csrfToken(),
            events: events,
            shownEvents: shownEvents,
            images: images,
            user: user || {},
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