process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 3000; //default to 3000

const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');

// security
const Tokens = require('csrf');

class AIPSApp {
    constructor() {
        this.nextApp = undefined;
        this.expressApp = undefined;
        this.tokens = undefined;
    }

    getExpressApp() {
        return this.expressApp;
    }

    getTokens() {
        return this.tokens;
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

        // XSRF
        this.tokens = new Tokens();
        
        // initialize routes
        this.initRoutes(this);
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

    initRoutes(aips) {
        require('./src/server/routes')(aips);
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