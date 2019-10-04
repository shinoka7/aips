process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000; //default to 3000

const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');

const middlewares = require('./src/server/middlewares');

// security
const expressDefend = require('express-defend');
const blacklist = require('express-blacklist');

const Cabin = require('cabin');
const cabin = new Cabin();

class AIPSApp {
    constructor() {
        this.nextApp = undefined;
        this.expressApp = undefined;
    }

    getExpressApp() {
        return this.expressApp;
    }

    /**
     * initialization
     * 
     * @returns Promise<any>
     */
    async init() {
        // initialize next
        this.nextApp = next({ dir: '.', dev: process.env.NODE_ENV === 'development' });
        await this.nextApp.prepare();

        // initialize express
        this.expressApp = express();
        this.initExpress(this.expressApp);
        
        // initialize routes
        this.initRoutes(this.nextApp, this.expressApp);
    }

    /**
     * initialize Express instance
     * @param {object} app express app
     */
    initExpress(app) {
        app.use('/resources', express.static('resources'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        const expressSession = require('express-session');
        const SequelizeStore = require('connect-session-sequelize')(expressSession.Store);
        const sequelize = require('./src/services/sequelize');

        const sessionStore = new SequelizeStore({ db: sequelize });
        
        app.use(
            expressSession({
                secret: 'secret-key',
                store: sessionStore,
                resave: false,
                saveUninitialized: false,
                proxy: true, // "X-Forwarded-Proto" header will be used
            })
        );

        // create database table
        sessionStore.sync();
    }

    initRoutes(nextApp, app) {
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
        app.use(middlewares.csrfKeyGenerator());

        // api routes
        app.use('/user', require('./src/server/routes/user')(nextApp));
        app.use('/group', require('./src/server/routes/group')(nextApp));
        app.use('/auth', require('./src/server/routes/auth')(nextApp));
        app.use('/post', require('./src/server/routes/post')(nextApp));

        // pages/index
        app.get('/', (req, res) => {
            nextApp.render(req, res, '/');
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
    }
}

const aipsApp = new AIPSApp();
aipsApp.init()
    .then(() => {
        const app = aipsApp.getExpressApp();

        // run
        app.listen(process.env.PORT, (err) => {
            if (err) {
                throw err;
            }
            console.log(`Ready on http://localhost:${process.env.PORT} as ${process.env.NODE_ENV}`);
        });
    }).catch((err) => {
        console.log('Error: Unable to start server\n', err);
    });