const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const googleService = require('../../services/google');
const cas = require('../../services/cas');

const { Account, User, Event } = require('../../db/models');

module.exports = (aips) => {
  const { nextApp, csrf } = aips;
  const middlewares = require('../middlewares')(aips);
  
  const {
    async: asyncMiddleware,
  } = middlewares;

  router.get('/google/authUrl', asyncMiddleware(async(req, res) => {
    const { client_secret, client_id, redirect_url } = googleService.googleConfig;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_url
    );

    const url = googleService.getAuthUrl(oAuth2Client);

    res.json({ url });
  }));

  router.get('/google/addEvent/:eventId(\\d+)', asyncMiddleware(async(req, res) => {
    const userId = req.session.user ? req.session.user.id : 0;
    const { eventId } = req.params;
    const selectedEvent = await Event.findByPk(eventId);
    const user = await User.findByPk(userId);
    if (!user || !selectedEvent) {
      return res.status(404).send({ error: 'user not found' });
    }

    const { client_secret, client_id, redirect_url } = googleService.googleConfig;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_url
    );

    oAuth2Client.setCredentials(user.googleToken);
    const event = await googleService.addEvent(oAuth2Client, selectedEvent);

    res.json({ event });
  }));

  // https://support.google.com/cloud/answer/7454865?authuser=0
  // DON'T CREATE USER, BUT ONLY LINK
  // ONLY ACCESSES THE CALENDARS ON SESSION => FUNC FOR ACCESS ALL THE TIME?
  router.get('/google/callback', asyncMiddleware(async(req, res) => {
    const userId = req.session.user ? req.session.user.id : 0;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ error: 'user not found' });
    }
    const { code } = req.query;
    const { client_secret, client_id, redirect_url } = googleService.googleConfig;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_url
    );

    await googleService.getAccessToken(oAuth2Client, code, user);

    return res.redirect('/');
  }));

  router.get('/cas', cas.bounce, asyncMiddleware(async(req, res) => {
    try {
      const user = req.session[cas.session_name].toLowerCase();
      const email = user + '@rpi.edu';
      // TODO currently will use RCS ID for user ==> can we access RIN?
      const account = await Account.createOrLink('cas', user, email);
      req.session.user = account.User;
      req.session.save((err) => {
        res.redirect('/user');
      });
    }
    catch (err) {
      console.log(err);
    }
  }));

  router.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return nextApp(err);
        } else {
          return res.redirect("/login");
        }
      })
    }
  });

    return router;
};