// https://developers.google.com/calendar/quickstart/nodejs

const { google } = require('googleapis');

class GoogleService {

    constructor() {
        this.googleConfig = {
            clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
            redirect: process.env.OAUTH_GOOGLE_REDIRECT_URL,
        };

        this.defaultScope = [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar',
        ];
    }

    createConnection() {
        return new google.auth.OAuth2(
            this.googleConfig.clientId,
            this.googleConfig.clientSecret,
            this.googleConfig.redirect,
        );
    }

    getConnectionUrl(auth) {
        return auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: this.defaultScope
        });
    }

    getGooglePlusApi(auth) {
        return google.plus({ version: 'v1', auth });
    }

    urlGoogle() {
        const auth = this.createConnection();
        const url = this.getConnectionUrl(auth);
        return url;
    }

    async getGoogleAccountFromCode(code) {
        const auth = this.createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        auth.setCredentials(tokens);
        const calendar = google.calendar({ version: 'v3', auth });
        const plus = this.getGooglePlusApi(auth);
        const me = await plus.people.get({ userId: 'me' });
        const userGoogleId = me.data.id;
        const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
        return {
          id: userGoogleId,
          email: userGoogleEmail,
          tokens: tokens,
          calendar: calendar,
        };
    }

}

const service = new GoogleService();
module.exports = service;