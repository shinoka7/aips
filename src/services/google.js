// https://developers.google.com/calendar/quickstart/nodejs

const { google } = require('googleapis');

class GoogleService {

    constructor() {
        this.googleConfig = {
            client_id: process.env.OAUTH_GOOGLE_CLIENT_ID,
            client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
            redirect_url: process.env.OAUTH_GOOGLE_REDIRECT_URL,
        };

        this.defaultScope = [
            'https://www.googleapis.com/auth/calendar',
        ];
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     */
    getAuthUrl(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.defaultScope,
        });
        return authUrl;
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    getAccessToken(oAuth2Client, code, user) {
        oAuth2Client.getToken(code, async(err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            // Store the token to disk for later program executions
            await user.update({ googleToken: token });
        });
    }

    /**
     * Create event 
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     * @param {model.event} selectedEvent The event selected to create a google event based on
     */
    addEvent(auth, selectedEvent) {
        const calendar = google.calendar({ version: 'v3', auth });
        const event = {
            summary: selectedEvent.name,
            description: selectedEvent.description,
            start: {
                timeZone: 'America/New_York',
                dateTime: this.createDateTime(selectedEvent.startTime, selectedEvent.startDate),
            },
            end: {
                timeZone: 'America/New_York',
                dateTime: this.createDateTime(selectedEvent.endTime, selectedEvent.endDate),
            },
            // attendees: [
            //     { email: selectedEvent.Group.groupEmail },
            // ],
        };

        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
        }, (err, event) => {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return;
            }
            console.log('Event created!');
        });

        // console.log(event);

        return event;
    }

    /**
     * Creates the dateTime string
     * @param {String} time
     * @param {String} date
     * @returns {String} combined datetime 
     */
    createDateTime(time, date) {
        const dateTime = date.concat('T').concat(time).concat(':00-04:00');
        // console.log(dateTime);
        return dateTime;
    }

    // createConnection() {
    //     return new google.auth.OAuth2(
    //         this.googleConfig.clientId,
    //         this.googleConfig.clientSecret,
    //         this.googleConfig.redirect,
    //     );
    // }

    // getConnectionUrl(auth) {
    //     return auth.generateAuthUrl({
    //         access_type: 'offline',
    //         prompt: 'consent',
    //         scope: this.defaultScope
    //     });
    // }

    // getGooglePlusApi(auth) {
    //     return google.plus({ version: 'v1', auth });
    // }

    // urlGoogle() {
    //     const auth = this.createConnection();
    //     const url = this.getConnectionUrl(auth);
    //     return url;
    // }

    // async getGoogleAccountFromCode(code) {
    //     const auth = this.createConnection();
    //     const data = await auth.getToken(code);
    //     const tokens = data.tokens;
    //     auth.setCredentials(tokens);
    //     const calendar = google.calendar({ version: 'v3', auth });
    //     const plus = this.getGooglePlusApi(auth);
    //     const me = await plus.people.get({ userId: 'me' });
    //     const userGoogleId = me.data.id;
    //     const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    //     return {
    //       id: userGoogleId,
    //       email: userGoogleEmail,
    //       tokens: tokens,
    //       calendar: calendar,
    //     };
    // }

}

const service = new GoogleService();
module.exports = service;